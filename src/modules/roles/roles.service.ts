import { Injectable } from '@nestjs/common';
import { AbstractService } from 'modules/common/abstract.service';
import { Role } from 'schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesService extends AbstractService<Role> {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {
    super(roleModel);
  }
}
