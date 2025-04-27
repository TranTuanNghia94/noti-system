import { Module } from "@nestjs/common";
import { KafkaModule } from "../kafka/kafka.module";
import { MongooseModule } from "@nestjs/mongoose";
import {
  NotificationSchema,
  Notification,
} from "src/schemas/notification.schema";
import { TelegramService } from "./telegram.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    KafkaModule,
  ],
  controllers: [],
  providers: [TelegramService],
})
export class TelegramModule {}
