import { Module } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Permission, PermissionSchema } from "../../schemas/permission.schema";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
