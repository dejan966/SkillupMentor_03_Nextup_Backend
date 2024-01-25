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

  @Prop({ default: 'default_profile.svg' })
  avatar: string;

  @Prop({ nullable: true })
  first_name: string;

  @Prop({ nullable: true })
  last_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ nullable: true, default: null })
  @Exclude()
  refresh_token: string;

  @Prop({ nullable: true, default: null })
  @Exclude()
  password_token: string;

  @Prop({ type: SchemaM.Types.ObjectId, ref: 'Role' })
  @Type(() => Role)
  role: Role;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: 'Event' }] })
  events: Event[];
}

export const UserSchema = SchemaFactory.createForClass(User);
