import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";
import { User } from "./user.schema";
import { Expose } from "class-transformer";
import { RolePermissions } from "./roles_permissions.schema";

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
})
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "User" }] })
  @Expose({ groups: ["include-users"] })
  users: User[];

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "RolePermissions" }] })
  @Expose({ groups: ["include-permissions"] })
  permissions: RolePermissions[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
