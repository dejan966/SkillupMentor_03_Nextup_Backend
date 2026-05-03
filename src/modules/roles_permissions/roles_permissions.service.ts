import { Injectable } from "@nestjs/common";
import { CreateRolesPermissionDto } from "./dto/create-roles_permission.dto";
import { UpdateRolesPermissionDto } from "./dto/update-roles_permission.dto";
import { AbstractService } from "../common/abstract.service";
import { RolePermissions, RolePermissionDocument } from "schemas/roles_permissions.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RolesPermissionsService extends AbstractService<RolePermissionDocument> {
  constructor(
    @InjectModel(RolePermissions.name)
    private roleModel: Model<RolePermissionDocument>,
  ) {
    super(roleModel);
  }
}
