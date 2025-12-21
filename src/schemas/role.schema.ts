import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Role {
  @Prop({ required: true })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    return ret;
  },
});
