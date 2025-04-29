import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // Get logger instance
   const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  

  // Enable CORS
  app.enableCors();

  await app.listen(3003);
  logger.log("Telegram Service is running on port 3003", {
    context: "Bootstrap",
    function: "bootstrap",
  });
}
bootstrap();
