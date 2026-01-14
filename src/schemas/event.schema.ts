import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaM, Types } from "mongoose";
import { User } from "./user.schema";
import { Type } from "class-transformer";

export type EventDocument = HydratedDocument<Event>;

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
})
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  hour: string;

  @Prop({ required: true })
  max_users: number;

  @Prop({ default: "" })
  description: string;

  @Prop({ nullable: true })
  image: string;

  @Prop({
    type: SchemaM.Types.ObjectId,
    ref: "User",
  })
  creator_id: Types.ObjectId;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "User" }] })
  @Type(() => User)
  booked_users: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.virtual("event_date").get(function (this: EventDocument) {
  return `${this.date} ${this.hour}`;
});

EventSchema.virtual("creator", {
  ref: "User",
  localField: "creator_id",
  foreignField: "_id",
  justOne: true,
});
