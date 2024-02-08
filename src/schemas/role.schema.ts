import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Role {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
