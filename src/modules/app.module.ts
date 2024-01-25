import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { RolesModule } from './roles/roles.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [UtilsModule, AuthModule, UsersModule, EventsModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
