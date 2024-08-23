import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { HydratedDocument, ObjectId, Schema as SchemaM } from 'mongoose';
import { Event } from './event.schema';
import { Role } from './role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ default: 'default-profile.png' })
  avatar: string;

  @Prop({ default: '' })
  first_name: string;

  @Prop({ default: '' })
  last_name: string;

  @Prop({ nullable: true })
  uid: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: 'Nextup User' })
  type: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ nullable: true, default: null })
  @Exclude()
  refresh_token: string;

  @Prop({ nullable: true, default: null })
  @Exclude()
  password_token: string;

  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: 'Role',
    default: '65b2716d8bd2810fe3bfc9dd',
  })
  @Type(() => Role)
  role: Role;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: 'Event' }] })
  @Type(() => Event)
  created_events: Event[];

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: 'Event' }] })
  @Type(() => Event)
  events_booked: Event[];
}

export const UserSchema = SchemaFactory.createForClass(User);
