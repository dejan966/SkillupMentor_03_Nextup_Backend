import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.entity';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Base {
  @Prop({ nullable: true })
  first_name: string;

  @Prop({ nullable: true })
  last_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ default: 'default_profile.svg' })
  avatar: string;

  @Prop({ nullable: true, default: null })
  @Exclude()
  refresh_token: string;

  @Prop({ nullable: true, default: null })
  @Exclude()
  password_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
