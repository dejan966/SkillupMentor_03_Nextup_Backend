import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AbstractService } from 'modules/common/abstract.service';
import { Event } from 'schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventsService extends AbstractService<Event> {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,
  ) {
    super(eventModel);
  }
}
