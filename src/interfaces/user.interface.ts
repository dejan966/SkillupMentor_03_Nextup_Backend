import { Types } from "mongoose";

export interface UserData {
  _id: Types.ObjectId;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
}
