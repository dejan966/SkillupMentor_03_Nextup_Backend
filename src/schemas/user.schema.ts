import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { PrimaryGeneratedColumn } from 'typeorm';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class User {
  @PrimaryGeneratedColumn()
  _id: string;
  
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
}

export const UserSchema = SchemaFactory.createForClass(User);
