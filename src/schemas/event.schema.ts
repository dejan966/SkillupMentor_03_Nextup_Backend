import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Event {
  @PrimaryGeneratedColumn()
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: Date.now(), required: true })
  date: string;

  @Prop({ default: Date.now(), required: true })
  hour: string;

  @Prop({ required: true })
  max_users: number;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: { _id: String, first_name: String, last_name: String, email: String } })
  creator: User;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User' })
  booked_users: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
