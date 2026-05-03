import { Module } from "@nestjs/common";
import { RolesPermissionsService } from "./roles_permissions.service";
import { RolesPermissionsController } from "./roles_permissions.controller";
import { Role, RoleSchema } from "schemas/role.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Permission, PermissionSchema } from "schemas/permission.schema";
import { UsersModule } from "../users/users.module";
import { RolesService } from "../roles/roles.service";
import { PermissionsService } from "../permissions/permissions.service";
import { RolePermissions, RolePermissionSchema } from "schemas/roles_permissions.schema";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: RolePermissions.name, schema: RolePermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [RolesPermissionsController],
  providers: [RolesPermissionsService, RolesService, PermissionsService],
  exports: [RolesPermissionsService],
})
export class RolesPermissionsModule {}
