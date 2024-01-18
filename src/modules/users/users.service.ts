import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdData = new this.userModel(createUserDto);
    return createdData.save();
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    try {
      for (const key in user) {
        if (updateUserDto[key] !== undefined) {
          user[key] = updateUserDto[key];
        }
      }
      await this.userModel.updateOne({ _id: id }, user);
      return user;
    } catch (error) {
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
