import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RoleType } from "../../../enums/role.enum";
import { Observable } from "rxjs";

@Injectable()
export class EventGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    for (const created_event of user.created_events) {
      if (created_event._id.toString() !== params.id || user.role.name === RoleType.ADMIN)
        return true;
    }
    return false;
  }
}
