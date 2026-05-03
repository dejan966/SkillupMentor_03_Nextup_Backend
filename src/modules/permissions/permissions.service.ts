import { Injectable } from "@nestjs/common";
import { AbstractService } from "../common/abstract.service";
import { Permission, PermissionDocument } from "../../schemas/permission.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class PermissionsService extends AbstractService<PermissionDocument> {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {
    super(permissionModel);
  }
}
