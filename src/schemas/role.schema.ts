import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";
import { User } from "./user.schema";
import { Type } from "class-transformer";

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
})
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "User" }] })
  @Type(() => User)
  users: User[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
