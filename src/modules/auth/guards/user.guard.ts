import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RoleType } from "../../../enums/role.enum";
import { Observable } from "rxjs";

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    if (user._id.toString() === params.id || user.role.name === RoleType.ADMIN) return true;
    return false;
  }
}
