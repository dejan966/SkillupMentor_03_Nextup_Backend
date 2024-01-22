import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';
import { AbstractService } from 'modules/common/abstract.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Event } from 'schemas/event.schema';

@Injectable()
export class UsersService extends AbstractService<User> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    super(userModel);
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.findBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User with that email already exists.');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAllUsers(){
    return await this.userModel.find().populate("events");
  }

  async addedEvent(user: User, event: Event){
    user.events.push(event._id);
    return await this.model.updateOne({ _id: user._id }, user);
  }
}
