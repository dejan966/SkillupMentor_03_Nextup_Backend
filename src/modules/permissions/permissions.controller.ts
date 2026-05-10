import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
  SerializeOptions,
} from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { Permission } from "../../schemas/permission.schema";
import MongooseClassSerializerInterceptor from "../../interceptors/mongoose.interceptor";
import { HybridAuthGuard } from "../auth/guards/hybrid.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Types } from "mongoose";

@Controller("permissions")
@UseInterceptors(MongooseClassSerializerInterceptor(Permission))
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @UseGuards(HybridAuthGuard, RoleGuard)
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @UseGuards(HybridAuthGuard, RoleGuard)
  @SerializeOptions({ groups: ["include-roles"] })
  async findAll(@Query("page") pageNumber: number) {
    return await this.permissionsService.findPaginate(pageNumber, "roles");
  }

  @Get(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  async findOne(@Param("id") _id: Types.ObjectId) {
    return await this.permissionsService.findById(_id);
  }

  @Patch(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  async update(
    @Param("id") _id: Types.ObjectId,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionsService.update(_id, updatePermissionDto);
  }

  @Delete(":id")
  @UseGuards(HybridAuthGuard, RoleGuard)
  async remove(@Param("id") _id: Types.ObjectId) {
    return await this.permissionsService.remove(_id);
  }
}
