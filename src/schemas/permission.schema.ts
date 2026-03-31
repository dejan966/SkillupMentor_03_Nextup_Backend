import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";
import { User } from "./user.schema";
import { Expose, Type } from "class-transformer";

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
})
export class Permission {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "Role",
  })
  role: Types.ObjectId;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
