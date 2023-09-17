import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as admin from "firebase-admin";
const expressServer = express();
require('dotenv').config();

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
};

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.F_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.F_CLIENT_EMAIL,
    projectId: process.env.F_PROJECT_ID
  }),
  databaseURL: process.env.F_DATABASE_URL
});

createFunction(expressServer);
