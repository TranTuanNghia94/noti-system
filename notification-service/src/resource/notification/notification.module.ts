import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { Notification, NotificationSchema } from "src/schemas/notification.schema";
import { KafkaModule } from "src/resource/kafka/kafka.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    KafkaModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
