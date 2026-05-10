import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";
import { RolePermissions } from "./roles_permissions.schema";

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
})
export class Permission {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: false,
  })
  description: string;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "RolePermissions" }] })
  @Expose({ groups: ["include-roles"] })
  roles: RolePermissions[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
