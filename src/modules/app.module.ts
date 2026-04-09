import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { EventsModule } from "./events/events.module";
import { RolesModule } from "./roles/roles.module";
import { UtilsModule } from "./utils/utils.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { RolesPermissionsModule } from "./roles_permissions/roles_permissions.module";

@Module({
  imports: [
    UtilsModule,
    AuthModule,
    UsersModule,
    EventsModule,
    RolesModule,
    PermissionsModule,
    RolesPermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
