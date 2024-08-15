import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const { headers } = context.switchToHttp().getRequest();
    if (headers.authorization) {
      const token = headers.authorization.split(' ')[1];
      if (token) {
        const decodedToken = this.decode(token);
        if (decodedToken) {
          return true;
        }
      }
    }

    return super.canActivate(context);
  }

  async decode(token: string) {
    const decoded = await this.usersService.decodeToken(token);
    return decoded;
  }
}
