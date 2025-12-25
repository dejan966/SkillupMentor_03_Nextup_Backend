import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Type } from "class-transformer";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";
import { Event } from "./event.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class User {
  @Prop({ default: "default-profile.png" })
  avatar: string;

  @Prop({ default: null })
  first_name: string;

  @Prop({ default: null })
  last_name: string;

  @Prop({ nullable: true })
  uid: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: "Nextup User" })
  type: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ nullable: true, default: null })
  @Exclude()
  refresh_token: string;

  @Prop({ nullable: true, default: null })
  @Exclude()
  password_token: string;

  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "Role",
  })
  role: Types.ObjectId;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "Event" }] })
  @Type(() => Event)
  created_events: Event[];

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "Event" }] })
  @Type(() => Event)
  events_booked: Event[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();

    if (doc.populated("role")) {
      ret.role._id = ret.role._id.toString();
    } else {
      ret.role = ret.role.toString();
    }

    return ret;
  },
});
