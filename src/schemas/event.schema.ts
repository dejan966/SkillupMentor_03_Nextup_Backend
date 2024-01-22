import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as S } from 'mongoose';
import { User } from './user.schema';
import { Transform, Type } from 'class-transformer';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Event {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

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

  @Prop({ type: S.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  creator: User;
  
  @Prop({ type: [{ type: S.Types.ObjectId, ref: 'User' }] })
  booked_users: S.Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
