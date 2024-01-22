import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'schemas/event.schema';
import { User, UserSchema } from 'schemas/user.schema';
import { UsersService } from 'modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { UtilsService } from 'modules/utils/utils.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService, UsersService, JwtService, UtilsService],
})
export class EventsModule {}
