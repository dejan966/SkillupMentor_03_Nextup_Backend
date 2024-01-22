import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AbstractService } from 'modules/common/abstract.service';
import { Event } from 'schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from 'schemas/user.schema';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class EventsService extends AbstractService<Event> {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,
    private readonly usersService: UsersService,
  ) {
    super(eventModel);
  }

  async addEvent(createEventDto: CreateEventDto, creator: User) {
    const createdEvent = new this.eventModel({ ...createEventDto, creator });
    createdEvent.save();
    return await this.usersService.addedEvent(creator, createdEvent);
  }

  async bookUser(_id: ObjectId, user: User) {
    const event = await this.findById(_id);
    if (event.booked_users.length < event.max_users) {
      event.booked_users.push(user._id);
      return await this.model.findOneAndUpdate({ _id }, event, {
        returnNewDocument: true,
      });
    } else if (event.booked_users.length === event.max_users) {
      throw new BadRequestException('Maximum amount of users reached.');
    }
  }
}
