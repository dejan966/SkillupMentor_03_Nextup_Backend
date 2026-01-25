import { Request } from "@nestjs/common";
import { Types } from "mongoose";
import { UserDocument } from "../schemas/user.schema";

export interface TokenPayload {
  name: string;
  sub: Types.ObjectId;
  type: JwtType;
}

export interface RequestWithUser extends Request {
  user: UserDocument;
}

export enum JwtType {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  PASSWORD_TOKEN = "PASSWORD_TOKEN",
}

export enum CookieType {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}
