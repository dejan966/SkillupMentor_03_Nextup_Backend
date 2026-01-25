import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { AbstractService } from "modules/common/abstract.service";
import { Event, EventDocument } from "schemas/event.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserDocument } from "schemas/user.schema";
import { UsersService } from "modules/users/users.service";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";
import { UtilsService } from "modules/utils/utils.service";
import { PaginatedResult } from "interfaces/paginated-result";
import Logging from "library/Logging";
import moment from "moment";

@Injectable()
export class EventsService extends AbstractService<EventDocument> {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    super(eventModel);
  }

  async addEvent(createEventDto: CreateEventDto, creator: UserDocument) {
    try {
      const createdEvent = new this.eventModel({ ...createEventDto, creator_id: creator._id });
      const created = createdEvent.save();
      await this.usersService.createdEvent(creator, createdEvent);
      return created;
    } catch (err) {
      Logging.error("Something went wrong: " + err);
    }
  }

  async eventSearch(
    searchValue: string,
    dateValue: string,
    pageNumber = 1,
  ): Promise<PaginatedResult<EventDocument>> {
    if (dateValue === "") {
      return;
    }

    if (searchValue === "") {
      const options = {
        date: {
          $eq: dateValue,
        },
      };
      return this.search(options, pageNumber);
    }

    const searchString = "^" + searchValue;
    const options = {
      location: new RegExp(searchString, "i"),
      date: {
        $eq: dateValue,
      },
    };
    return this.search(options, pageNumber);
  }

  async search<TOptions>(options: TOptions, pageNumber: number) {
    const take = 3;
    const skip = take * (pageNumber - 1);

    try {
      const search = await this.eventModel.find(options).limit(take).skip(skip);

      const searchDocuments = await this.eventModel.countDocuments(options);
      return {
        data: search,
        meta: {
          total: searchDocuments,
          page: pageNumber,
          last_page: Math.ceil(searchDocuments / take),
        },
      };
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        "Something went wrong while searching for paginated elements.",
      );
    }
  }

  async updateEventImageId(_id: Types.ObjectId, image: string): Promise<EventDocument> {
    const updatedEvent = await this.eventModel.findOneAndUpdate(
      { _id },
      { $set: { image: image } },
      { returnDocument: "after" },
    );

    return updatedEvent;
  }

  async upcomingEvents() {
    var momentDate = moment();
    const date = momentDate.format("YYYY-MM-D");
    const upcomingE = await this.eventModel.find({
      date: { $gt: date },
    });

    return upcomingE;
  }

  async recentEvents() {
    var momentDate = moment();
    const date = momentDate.format("YYYY-MM-D");
    const recentE = await this.eventModel.find({
      date: { $lt: date },
    });

    return recentE;
  }

  async bookUser(_id: Types.ObjectId, user: UserDocument) {
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
      throw new BadRequestException("Maximum amount of users reached.");
    }
  }

  async scheduleEmail(event: EventDocument, user: UserDocument) {
    const subject = "Reminder";
    const text = `Hi<p>Please, dont forget about the event that will be at.</p>`;
    const html = `Hi<p>Please, dont forget about the event that will be at ${
      event.date + " " + event.hour
    }.</p><p>Your Nextup support team</p>`;

    const sendDate = moment(event.date).toDate();

    const hours = event.hour.split(":");
    sendDate.setHours(parseInt(hours[0]), parseInt(hours[1]));
    sendDate.setDate(sendDate.getDate() - 1);

    const job = new CronJob(sendDate, () => {
      this.utilsService.sendEmail({
        from: "Nextup Support <ultimate24208@gmail.com>",
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
