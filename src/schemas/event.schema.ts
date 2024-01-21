import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Event {
  @PrimaryGeneratedColumn()
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: 'time', required: true })
  hour: Date;

  @Prop({ required: true })
  max_users: number;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  creator: User;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User' })
  booked_users: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
