import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
  await app.init();
};

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.F_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.F_CLIENT_EMAIL,
    projectId: process.env.F_PROJECT_ID
  }),
  databaseURL: process.env.F_DATABASE_URL
});

export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer).then(v => console.log('nest ready')).catch(err=>console.log('Nest broken', err));
  expressServer(request, response);
});
