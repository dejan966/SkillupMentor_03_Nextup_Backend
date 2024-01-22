import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { HydratedDocument, ObjectId, Schema as S } from 'mongoose';

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

  @Prop({ type: [{ type: S.Types.ObjectId, ref: 'Event' }] })
  events: S.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
