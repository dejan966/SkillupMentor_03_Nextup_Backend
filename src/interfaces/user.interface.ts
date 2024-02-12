import { ObjectId } from 'mongoose';

export interface UserData {
  _id: ObjectId;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
}
