import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AbstractService } from 'modules/common/abstract.service';
import { Event } from 'schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'schemas/user.schema';

@Injectable()
export class EventsService extends AbstractService<Event> {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,
  ) {
    super(eventModel);
  }

  async addUser(_id: string, user: User){
    const event = await this.findById(_id);
    if (event.booked_users.length < event.max_users){
      event.booked_users.push(user)
      return await this.model.findOneAndUpdate({ _id }, event, { returnNewDocument: true });
    } else if (event.booked_users.length === event.max_users) {
      console.log("Maximum amount of users reached")
    }
  }
}
