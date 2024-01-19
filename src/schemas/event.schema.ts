import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Event {
  @PrimaryGeneratedColumn()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  location: string;

  @Prop()
  date: Date;

  @Prop({ type: 'time' })
  hour: Date;

  @Prop()
  max_users: number;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  booked_users: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
