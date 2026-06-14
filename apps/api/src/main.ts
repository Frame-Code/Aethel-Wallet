import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.setGlobalPrefix('v1');
  const port = process.env['PORT'] ?? 3001;
  await app.listen(port);
  Logger.log(`API corriendo en http://localhost:${port}/v1`, 'Bootstrap');
}

bootstrap();
