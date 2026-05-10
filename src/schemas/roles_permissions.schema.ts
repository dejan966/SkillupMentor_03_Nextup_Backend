import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";

export type RolePermissionDocument = HydratedDocument<RolePermissions>;

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
})
export class RolePermissions {
  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "Role",
  })
  role: Types.ObjectId;

  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "Permission",
  })
  permission: Types.ObjectId;

  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "User",
  })
  granted_by: Types.ObjectId;

  @Prop({ required: false })
  expires_at: Date;
}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermissions);
