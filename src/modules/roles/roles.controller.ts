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
@UseInterceptors(MongooseClassSerializerInterceptor(Role))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') _id: string) {
    return await this.rolesService.findById(_id);
  }

  @Patch(':id')
  async update(@Param('id') _id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(_id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') _id: string) {
    return await this.rolesService.remove(_id);
  }
}
