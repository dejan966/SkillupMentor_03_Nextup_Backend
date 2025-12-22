import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { UtilsModule } from "modules/utils/utils.module";
import { Role, RoleSchema } from "schemas/role.schema";
import { RolesModule } from "modules/roles/roles.module";

@Module({
  imports: [
    UtilsModule,
    RolesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
