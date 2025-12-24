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
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Types } from "mongoose";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "modules/auth/guards/role.guard";
import { Role } from "schemas/role.schema";
import MongooseClassSerializerInterceptor from "interceptors/mongoose.interceptor";
import { JwtAuthGuard } from "modules/auth/guards/jwt.guard";

@Controller("roles")
@UseInterceptors(MongooseClassSerializerInterceptor(Role))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll(@Query("page") pageNumber: number) {
    return await this.rolesService.findPaginate(pageNumber);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findOne(@Param("id") _id: Types.ObjectId) {
    return await this.rolesService.findById(_id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(@Param("id") _id: Types.ObjectId, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(_id, updateRoleDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(@Param("id") _id: Types.ObjectId) {
    return await this.rolesService.remove(_id);
  }
}
