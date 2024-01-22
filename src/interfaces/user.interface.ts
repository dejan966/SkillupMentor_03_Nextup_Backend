import { ObjectId } from "mongoose";

export interface UserData {
  id: ObjectId;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
}
