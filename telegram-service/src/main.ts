import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Telegram Service API')
    .setDescription('The telegram service API description')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Get logger instance
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);


  // Enable CORS
  app.enableCors();

  await app.listen(3003);
  logger.log("Telegram Service is running on port 3003", {
    context: "Bootstrap",
    function: "bootstrap",
  });
}
bootstrap();
