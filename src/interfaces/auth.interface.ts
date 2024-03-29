import { Request } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { User } from 'schemas/user.schema';

export interface TokenPayload {
  name: string;
  sub: ObjectId;
  type: JwtType;
}

export interface RequestWithUser extends Request {
  user: User;
}

export enum JwtType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  PASSWORD_TOKEN = 'PASSWORD_TOKEN',
}

export enum CookieType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}
