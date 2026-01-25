import { Injectable } from "@nestjs/common";
import { AbstractService } from "../common/abstract.service";
import { Role, RoleDocument } from "../../schemas/role.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RolesService extends AbstractService<RoleDocument> {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
  ) {
    super(roleModel);
  }
}
