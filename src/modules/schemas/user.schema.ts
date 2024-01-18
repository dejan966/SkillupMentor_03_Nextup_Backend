import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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
