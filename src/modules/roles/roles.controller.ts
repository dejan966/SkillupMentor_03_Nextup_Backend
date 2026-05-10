import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  SerializeOptions,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Types } from "mongoose";
import { RoleGuard } from "../auth/guards/role.guard";
import { Role } from "../../schemas/role.schema";
import MongooseClassSerializerInterceptor from "../../interceptors/mongoose.interceptor";
import { HybridAuthGuard } from "../auth/guards/hybrid.guard";

@Controller("roles")
@UseInterceptors(MongooseClassSerializerInterceptor(Role))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(HybridAuthGuard, RoleGuard)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @UseGuards(HybridAuthGuard, RoleGuard)
  @SerializeOptions({ groups: ["include-users", "include-permissions"] })
  async findAll(@Query("page") pageNumber: number) {
    return await this.rolesService.findPaginate(pageNumber, "permissions", "permission role");
  }

  @Get(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  @SerializeOptions({ groups: ["include-permissions"] })
  async findOne(@Param("id") _id: Types.ObjectId) {
    return await this.rolesService.findById(_id);
  }

  @Patch(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  async update(@Param("id") _id: Types.ObjectId, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(_id, updateRoleDto);
  }

  @Delete(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  async remove(@Param("id") _id: Types.ObjectId) {
    return await this.rolesService.remove(_id);
  }
}
