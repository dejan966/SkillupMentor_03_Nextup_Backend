import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose, Type } from "class-transformer";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";
import { Event } from "./event.schema";
import { Role } from "./role.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
})
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
  @Expose({ groups: ["include-role"] })
  role: Types.ObjectId;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "Event" }] })
  @Type(() => Event)
  @Exclude()
  created_events: Event[];

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "Event" }] })
  @Type(() => Event)
  @Exclude()
  events_booked: Event[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual("full_name").get(function (this: UserDocument) {
  return `${this.first_name} ${this.last_name}`;
});
