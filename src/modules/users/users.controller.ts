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
import MongooseClassSerializerInterceptor from 'interceptors/mongoose.interceptor';

@Controller('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@GetCurrentUser() user: User) {
    return user;
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll('created_events events_booked');
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('avatar', saveAvatarToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') _id: string,
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
  @UseGuards(JwtAuthGuard)
  async checkToken(
    @Param('id') user_id: string,
    @Param('token') hashed_token: string,
  ) {
    const user = await this.usersService.findById(user_id);
    return this.usersService.checkToken(user, hashed_token);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') _id: string) {
    const user = await this.usersService.findById(
      _id,
      'created_events events_booked',
    );
    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async update(@Param('id') _id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(_id, updateUserDto);
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
  async remove(@Param('id') _id: string) {
    return await this.usersService.remove(_id);
  }
}
