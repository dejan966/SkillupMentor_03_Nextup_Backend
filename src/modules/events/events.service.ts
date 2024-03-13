import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { AbstractService } from 'modules/common/abstract.service';
import { Event } from 'schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from 'schemas/user.schema';
import { UsersService } from 'modules/users/users.service';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UtilsService } from 'modules/utils/utils.service';

@Injectable()
export class EventsService extends AbstractService<Event> {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    super(eventModel);
  }

  async addEvent(createEventDto: CreateEventDto, creator: User) {
    try {
      const createdEvent = new this.eventModel({ ...createEventDto, creator });
      const created = createdEvent.save();
      await this.usersService.createdEvent(creator, createdEvent);
      return created;
    } catch (err) {
      console.error('Something went wrong: ' + err);
    }
  }

  async eventSearch(searchValue: string, dateValue: string) {
    const allEvents = await this.findAll('creator booked_users');
    const search = allEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        event.date.toISOString().substring(0, 10) ==
          new Date(dateValue).toISOString().substring(0, 10),
    );
    return search;
  }

  async updateEventImageId(_id: ObjectId, image: string): Promise<Event> {
    const event = await this.findById(_id);
    if (image === event.image) {
      throw new BadRequestException('Images have to be different.');
    }

    const updatedEvent = await this.eventModel.findOneAndUpdate(
      { _id },
      { $set: { image: image } },
      { returnDocument: 'after' },
    );

    return updatedEvent;
  }

  async currUserUpcomingEvents(user: User) {
    const allEvents = await this.findAll('creator booked_users');

    const upcoming = allEvents.filter(
      (event) =>
        event.booked_users.map((s) => s._id == user._id) &&
        event.date.getTime() > new Date().getTime(),
    );
    return upcoming;
  }

  async currUserRecentEvents(user: User) {
    const allEvents = await this.findAll('creator booked_users');

    const recent = allEvents.filter(
      (event) =>
        event.booked_users.map((s) => s._id == user._id) &&
        event.date.getTime() < new Date().getTime(),
    );
    return recent;
  }

  async upcomingEvents(page = 1) {
    const take = 3;
    try {
      const data = await this.eventModel.aggregate([
        {
          $facet: {
            totalData: [{ $match: {} }, { $skip: 3 }, { $limit: 3 }],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);
      //console.log(data.map((e) => console.log(e)));
      const allEvents = await this.findAll('creator booked_users');
      const upcoming = allEvents.filter(
        (event) => event.date.getTime() > new Date().getTime(),
      );
      return upcoming;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for paginated elements.',
      );
    }
  }

  async recentEvents() {
    const allEvents = await this.findAll('creator booked_users');
    const recent = allEvents.filter(
      (event) => event.date.getTime() < new Date().getTime(),
    );
    return recent;
  }

  async bookUser(_id: ObjectId, user: User) {
    const event = await this.findById(_id);
    if (event.booked_users.length < event.max_users) {
      await event.updateOne({
        $push: {
          booked_users: user._id,
        },
      });
      await this.usersService.bookEvent(user, event);
      this.scheduleEmail(event, user);
      return event;
    } else if (event.booked_users.length === event.max_users) {
      throw new BadRequestException('Maximum amount of users reached.');
    }
  }

  async scheduleEmail(event, user: User) {
    const subject = 'Reminder';
    const text = `Hi<p>Please, dont forget about the event that will be at.</p>`;
    const html = `Hi<p>Please, dont forget about the event that will be at ${
      event.date + ' ' + event.hour
    }.</p><p>Your Nextup support team</p>`;
    const sendDate = new Date(event.date);

    const hours = event.hour.toString().split(':');
    sendDate.setHours(hours[0], hours[1]);
    sendDate.setDate(sendDate.getDate() - 1);

    const job = new CronJob(sendDate, () => {
      this.utilsService.sendEmail({
        from: 'Nextup Support <ultimate24208@gmail.com>',
        to: user.email,
        date: sendDate,
        subject: subject,
        text: text,
        html: html,
      });
    });

    this.schedulerRegistry.addCronJob(`${Date.now()}-${subject}`, job);
    job.start();
  }
}
