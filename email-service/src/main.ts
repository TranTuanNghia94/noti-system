import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  
  // Enable CORS
  app.enableCors();
  
  await app.listen(3002);
  logger.log("Email Service is running on port 3002", {
    context: "Bootstrap",
    function: "bootstrap",
  });
}
bootstrap(); 