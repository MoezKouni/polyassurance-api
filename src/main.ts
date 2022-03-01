import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe())
  app.use('/upload', express.static(join(__dirname, '..', 'upload')));
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
