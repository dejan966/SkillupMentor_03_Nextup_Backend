import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaM } from "mongoose";
import { User } from "./user.schema";
import { Type } from "class-transformer";

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
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

  @Prop({ type: SchemaM.Types.ObjectId, ref: "User" })
  @Type(() => User)
  creator: User;

  @Prop({ type: [{ type: SchemaM.Types.ObjectId, ref: "User" }] })
  @Type(() => User)
  booked_users: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    return ret;
  },
});
