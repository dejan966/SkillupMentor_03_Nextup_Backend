import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { RolesPermissionsService } from "./roles_permissions.service";
import { CreateRolesPermissionDto } from "./dto/create-roles_permission.dto";
import { UpdateRolesPermissionDto } from "./dto/update-roles_permission.dto";
import { Types } from "mongoose";
import { HybridAuthGuard } from "modules/auth/guards/hybrid.guard";
import { RoleGuard } from "modules/auth/guards/role.guard";

@Controller("roles-permissions")
export class RolesPermissionsController {
  constructor(private readonly rolesPermissionsService: RolesPermissionsService) {}

  @Post()
  @UseGuards(HybridAuthGuard, RoleGuard)
  async create(@Body() createRolesPermissionDto: CreateRolesPermissionDto) {
    return await this.rolesPermissionsService.create(createRolesPermissionDto);
  }

  @Get()
  @UseGuards(HybridAuthGuard, RoleGuard)
  async findAll() {
    return await this.rolesPermissionsService.findAll();
  }

  @Get(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  async findOne(@Param("id") id: Types.ObjectId) {
    return await this.rolesPermissionsService.findById(id);
  }

  @Patch(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  async update(
    @Param("id") id: Types.ObjectId,
    @Body() updateRolesPermissionDto: UpdateRolesPermissionDto,
  ) {
    return await this.rolesPermissionsService.update(id, updateRolesPermissionDto);
  }

  @Delete(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  async remove(@Param("id") id: Types.ObjectId) {
    return await this.rolesPermissionsService.remove(id);
  }
}
