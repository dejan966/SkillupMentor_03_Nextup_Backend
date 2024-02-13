import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as SchemaM } from 'mongoose';
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

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  hour: string;

  @Prop({ required: true })
  max_users: number;

  @Prop({ nullable: true })
  description: string;

  @Prop({ nullable: true })
  image: string;

  @Prop({ type: SchemaM.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  creator: User;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: 'User' }] })
  @Type(() => User)
  booked_users: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
