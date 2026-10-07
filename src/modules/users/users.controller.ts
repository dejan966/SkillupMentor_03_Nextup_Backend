import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Query,
  SerializeOptions,
  InternalServerErrorException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetCurrentUser } from "../../decorators/get-current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { User, UserDocument } from "../../schemas/user.schema";
import { UserGuard } from "../auth/guards/user.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { Express } from "express";
import { Types } from "mongoose";
import { RoleGuard } from "../auth/guards/role.guard";
import { UtilsService } from "../utils/utils.service";
import MongooseClassSerializerInterceptor from "../../interceptors/mongoose.interceptor";
import { PaginatedResult } from "../../interfaces/paginated-result";
import { HybridAuthGuard } from "../auth/guards/hybrid.guard";
import { memoryStorage } from "multer";
import { randomUUID } from "crypto";
import Logging from "library/Logging";

@Controller("users")
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private utilsService: UtilsService,
  ) {}

  @Post()
  @UseGuards(HybridAuthGuard, RoleGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword: string = await this.utilsService.hash(createUserDto.password);
    return await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @Get("me")
  @UseGuards(HybridAuthGuard)
  async getCurrentUser(@GetCurrentUser() user: UserDocument) {
    return user;
  }

  @Get()
  @UseGuards(HybridAuthGuard, RoleGuard)
  @SerializeOptions({ groups: ["include-role"] })
  async findAll(@Query("page") pageNumber: number): Promise<PaginatedResult<UserDocument>> {
    return await this.usersService.findPaginate(pageNumber, "role", "permissions");
  }

  @Post("upload/:id")
  @UseGuards(HybridAuthGuard, UserGuard)
  @UseInterceptors(FileInterceptor("avatar", {storage: memoryStorage()}))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") _id: Types.ObjectId,
  ): Promise<UserDocument> {
    try {
      const uniqueSuffix = randomUUID();
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      await this.utilsService.uploadFileToS3(file, filename, 'uploads/avatars')
      return this.usersService.updateUserImageId(_id, filename);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        "Something went wrong while uploading user avatar",
      );
    }
  }

  @Get(":id/:token(*)")
  @UseGuards(JwtAuthGuard, UserGuard)
  async checkToken(@Param("id") user_id: Types.ObjectId, @Param("token") hashed_token: string) {
    const user = await this.usersService.findById(user_id);
    return this.usersService.checkToken(user, hashed_token);
  }

  @Get(":id")
  @UseGuards(HybridAuthGuard, UserGuard)
  @SerializeOptions({ groups: ["include-role"] })
  async findById(@Param("id") _id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.usersService.findById(_id);
    return user;
  }

  @Patch(":id")
  @UseGuards(HybridAuthGuard, UserGuard)
  async update(@Param("id") _id: Types.ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(_id, updateUserDto);
  }

  @Patch("/me/update-password")
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @GetCurrentUser() user: UserDocument,
    @Body()
    updateUserDto: {
      password: string;
      new_password: string;
      confirm_password: string;
    },
  ) {
    return await this.usersService.updatePassword(user, updateUserDto);
  }

  /* @Post("me/update-avatar")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("avatar", saveAvatarToStorage))
  async uploadAvatar(
    @GetCurrentUser() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserDocument> {
    const filename = file?.filename;
    if (!filename) throw new BadRequestException("File must be a png, jpg/jpeg");

    const imagesFolderPath = join(process.cwd(), "uploads/avatars");
    const fullImagePath = join(imagesFolderPath + "/" + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.usersService.updateUserImageId(user._id, filename);
    }
    removeFile(fullImagePath);
    throw new BadRequestException("File content does not match extension!");
  } */

  @Post("me/reset-password")
  @UseGuards(JwtAuthGuard)
  async resetPassword(@Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.checkEmail(updateUserDto.email);
  }

  @Delete(":id")
  @UseGuards(HybridAuthGuard, UserGuard)
  async remove(@Param("id") _id: Types.ObjectId) {
    return await this.usersService.remove(_id);
  }
}
