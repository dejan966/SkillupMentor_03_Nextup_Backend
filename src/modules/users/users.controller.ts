import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { User } from 'schemas/user.schema';
import { ObjectId } from 'mongoose';
import { UserGuard } from 'modules/auth/guards/user.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@GetCurrentUser() user: User) {
    return user;
  }

  @Get()
  async findAll() {
    return this.usersService.findAll('booked_users');
  }

  @Get(':id/:token(*)')
  @UseGuards(JwtAuthGuard)
  async checkToken(
    @Param('id') user_id: ObjectId,
    @Param('token') hashed_token: string,
  ) {
    const user = await this.usersService.findById(user_id);
    return this.usersService.checkToken(user, hashed_token);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') _id: ObjectId) {
    return this.usersService.findById(_id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async update(
    @Param('id') _id: ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(_id, updateUserDto);
  }

  @Patch('/me/update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @GetCurrentUser() user: User,
    @Body()
    updateUserDto: {
      current_password: string;
      password: string;
      confirm_password: string;
    },
  ) {
    return this.usersService.updatePassword(user, updateUserDto);
  }

  @Post('me/reset-password')
  @UseGuards(JwtAuthGuard)
  async checkEmail(@Body() updateUserDto: { email: string }) {
    return this.usersService.checkEmail(updateUserDto.email);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async remove(@Param('id') _id: ObjectId) {
    return this.usersService.remove(_id);
  }
}
