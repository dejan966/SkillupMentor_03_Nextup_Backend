import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'schemas/role.schema';
import MongooseClassSerializerInterceptor from 'interceptors/mongoose.interceptor';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll('');
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.rolesService.findById(_id);
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(_id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.rolesService.remove(_id);
  }
}
