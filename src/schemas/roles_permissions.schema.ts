import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";

export type RolePermissionDocument = HydratedDocument<RolePermissions>;

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
})
export class RolePermissions {
  @Prop({ required: true })
  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "Role",
  })
  role_id: Types.ObjectId;

  @Prop({
    required: true,
  })
  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "Permission",
  })
  permission_id: Types.ObjectId;

  @Prop({ required: true })
  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "User",
  })
  granted_by: Types.ObjectId;

  @Prop({ required: false })
  expires_at: Date;
}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermissions);
