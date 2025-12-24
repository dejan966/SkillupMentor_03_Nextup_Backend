import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "modules/users/users.service";
import { JwtAuthGuard } from "./jwt.guard";
import * as admin from "firebase-admin";

@Injectable()
export class HybridAuthGuard extends JwtAuthGuard {
  constructor(reflector: Reflector, private readonly usersService: UsersService) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const jwtResult = await super.canActivate(context);
      if (jwtResult) return true;
    } catch (error) {
      console.log("JWT auth failed, trying Firebase:");
    }

    const request = context.switchToHttp().getRequest();
    const token = request?.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException("No authentication token found");
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await this.usersService.getFirebaseUserByUid(decodedToken.uid);

      if (!user) {
        throw new UnauthorizedException("Firebase user not found");
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException("Authentication failed");
    }
  }
}
