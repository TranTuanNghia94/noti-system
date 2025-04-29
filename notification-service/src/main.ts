import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { swaggerConfig } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Get logger instance
   const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  // Enable CORS
  app.enableCors();

  
  await app.listen(3000);
  logger.info("Notification Service is running on port 3000", {
    context: "Bootstrap",
    function: "bootstrap",
  });
}
bootstrap();
