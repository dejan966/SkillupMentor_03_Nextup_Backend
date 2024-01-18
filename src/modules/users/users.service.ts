import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    const user = await this.findBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User with that email already exists.');
    }
    const createdData = new this.userModel(createUserDto);
    return createdData.save();
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findById(_id: string) {
    return await this.userModel.findById(_id);
  }

  async findBy(condition) {
    try {
      const user = this.userModel.findOne(condition)
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with condition: ${condition}.`,
      );
    }
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(_id);
    try {
      for (const key in user) {
        if (updateUserDto[key] !== undefined) {
          user[key] = updateUserDto[key];
        }
      }
      await this.userModel.updateOne({ _id }, user);
      return user;
    } catch (error) {
      throw new NotFoundException(
        'Something went wrong while updating the data.',
      );
    }
  }

  async remove(_id: string) {
    return `This action removes a #${_id} user`;
  }
}
