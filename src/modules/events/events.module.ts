import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'schemas/event.schema';
import { User, UserSchema } from 'schemas/user.schema';
import { UsersModule } from 'modules/users/users.module';
import { UtilsService } from 'modules/utils/utils.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService, UtilsService],
  exports: [EventsService],
})
export class EventsModule {}
