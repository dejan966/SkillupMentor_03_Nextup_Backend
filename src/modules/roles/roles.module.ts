import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "schemas/role.schema";
import { UsersModule } from "modules/users/users.module";

@Module({
  imports: [UsersModule, MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
