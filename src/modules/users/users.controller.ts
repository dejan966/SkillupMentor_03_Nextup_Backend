import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { User } from 'schemas/user.schema';
import { UserGuard } from 'modules/auth/guards/user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Express } from 'express';
import {
  saveAvatarToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'helpers/imageStorage';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'modules/auth/guards/role.guard';
import { UtilsService } from 'modules/utils/utils.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private utilsService: UtilsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard(['jwt', 'firebase']), RoleGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword: string = await this.utilsService.hash(
      createUserDto.password,
    );
    return await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @Get('me')
  @UseGuards(AuthGuard(['jwt', 'firebase']))
  async getCurrentUser(@GetCurrentUser() user: User) {
    return user;
  }

  @Get()
  @UseGuards(AuthGuard(['jwt', 'firebase']), RoleGuard)
  async findAll(@Query('page') pageNumber: number) {
    return await this.usersService.findPaginate(
      pageNumber,
      'role created_events events_booked',
    );
  }

  @Post('upload/:id')
  @UseGuards(AuthGuard(['jwt', 'firebase']), UserGuard)
  @UseInterceptors(FileInterceptor('avatar', saveAvatarToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') _id: ObjectId,
  ): Promise<User> {
    const filename = file?.filename;
    if (!filename)
      throw new BadRequestException('File must be a png, jpg/jpeg');

    const imagesFolderPath = join(process.cwd(), 'uploads/avatars');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.usersService.updateUserImageId(_id, filename);
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension!');
  }

  @Get(':id/:token(*)')
  @UseGuards(JwtAuthGuard, UserGuard)
  async checkToken(
    @Param('id') user_id: ObjectId,
    @Param('token') hashed_token: string,
  ) {
    const user = await this.usersService.findById(user_id);
    return this.usersService.checkToken(user, hashed_token);
  }

  @Get(':id')
  @UseGuards(AuthGuard(['jwt', 'firebase']), UserGuard)
  async findById(@Param('id') _id: ObjectId) {
    const user = await this.usersService.findById(
      _id,
      'role created_events events_booked',
    );
    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard(['jwt', 'firebase']), UserGuard)
  async update(
    @Param('id') _id: ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(_id);
    const { password, new_password, confirm_password } = updateUserDto;
    if (password !== '') {
      return await this.usersService.updatePassword(user, {
        password,
        new_password,
        confirm_password,
      });
    }
    return await this.usersService.update(_id, {
      ...updateUserDto,
    });
  }

  @Patch('/me/update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @GetCurrentUser() user: User,
    @Body()
    updateUserDto: {
      password: string;
      new_password: string;
      confirm_password: string;
    },
  ) {
    return await this.usersService.updatePassword(user, updateUserDto);
  }

  @Post('me/reset-password')
  @UseGuards(JwtAuthGuard)
  async checkEmail(@Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.checkEmail(updateUserDto.email);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async remove(@Param('id') _id: ObjectId) {
    return await this.usersService.remove(_id);
  }
}
