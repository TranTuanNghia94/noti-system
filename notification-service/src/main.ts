import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle("Notification Service API")
    .setDescription("The notification service API description")
    .setVersion("1.0")
    .addApiKey({ type: "apiKey", name: "x-api-key", in: "header" }, "api-key")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Enable CORS
  app.enableCors();

  // Get logger instance
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  
  await app.listen(3000);
  logger.info("Notification Service is running on port 3000", {
    context: "Bootstrap",
    function: "bootstrap",
  });
}
bootstrap();
