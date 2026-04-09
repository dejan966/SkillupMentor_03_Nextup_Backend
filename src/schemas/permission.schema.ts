import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";

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
}

export enum Permissions {
  USERS_CREATE = "users:create",
  USERS_READ = "users:read",
  USERS_UPDATE = "users:update",
  USERS_DELETE = "users:delete",
  EVENTS_CREATE = "events:create",
  EVENTS_READ = "events:read",
  EVENTS_UPDATE = "events:update",
  EVENTS_DELETE = "events:delete",
  ROLES_CREATE = "roles:create",
  ROLES_READ = "roles:read",
  ROLES_UPDATE = "roles:update",
  ROLES_DELETE = "roles:delete",
  PERMISSIONS_CREATE = "permissions:create",
  PERMISSIONS_READ = "permissions:read",
  PERMISSIONS_UPDATE = "permissions:update",
  PERMISSIONS_DELETE = "permissions:delete",
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
