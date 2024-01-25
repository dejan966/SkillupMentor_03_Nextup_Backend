import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AbstractService } from 'modules/common/abstract.service';
import { Role } from 'schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesService extends AbstractService<Role> {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>
  ) {
    super(roleModel);
  }
}
