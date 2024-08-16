import { NestFactory } from '@nestjs/core';
import { AppModule } from 'modules/app.module';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'path';
import cookieParser from 'cookie-parser';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const expressInstance = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const dirname = path.resolve();
  app.use('/uploads', express.static(path.join(dirname, '/uploads')));

  const config = new DocumentBuilder()
    .setTitle('Nextup')
    .setDescription('This is the Nextup app')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.F_PROJECT_ID,
    clientEmail: process.env.F_CLIENT_EMAIL,
    privateKey: process.env.F_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.F_DATABASE_URL,
});

bootstrap();
