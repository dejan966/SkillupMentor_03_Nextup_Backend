import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { UtilsService } from "./utils.service";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.RAILWAY_ENVIRONMENT === "production",
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_SERVER,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    MongooseModule.forRoot(process.env.MONGOOSE_DATABASE_URL),
  ],
  controllers: [],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
