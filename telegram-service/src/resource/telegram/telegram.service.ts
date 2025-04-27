import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KafkaService } from "../kafka/kafka.service";
import * as TelegramBot from "node-telegram-bot-api";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Notification } from "src/schemas/notification.schema";
import { KAFKA_TOPICS } from "src/constants/resource.constants";
import { TelegramMessage } from "src/interface/notification.interface";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject } from "@nestjs/common";

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService
  ) {
    this.bot = new TelegramBot(this.configService.get("TELEGRAM_BOT_TOKEN"));
    this.logger.info("TelegramService initialized", {
      context: TelegramService.name,
      function: this.constructor.name,
    });
  }

  async onModuleInit() {
    await this.kafkaService.subscribe(
      KAFKA_TOPICS.TELEGRAM_NOTIFICATION,
      this.handleTelegramNotification.bind(this)
    );
    this.logger.info("TelegramService initialized", {
      context: TelegramService.name,
      function: this.onModuleInit.name,
    });
  }

  async onModuleDestroy() {
    this.bot.close();
    this.logger.info("TelegramService destroyed", {
      context: TelegramService.name,
      function: this.onModuleDestroy.name,
    });
  }

  private async sendMessage(data: TelegramMessage) {
    const chatId = this.configService.get("TELEGRAM_CHAT_ID");
    this.logger.info("Sending message to Telegram", {
      context: TelegramService.name,
      function: this.sendMessage.name,
      data: JSON.stringify(data),
    });
    await this.bot.sendMessage(chatId, data.message);
  }

  private async handleTelegramNotification(message: TelegramMessage) {
    try {
      await this.sendMessage(message);
      await this.updateNotificationStatus(message.id, "SUCCESS");
      this.logger.info("Telegram notification sent", {
        context: TelegramService.name,
        function: this.handleTelegramNotification.name,
        data: JSON.stringify(message),
      });
    } catch (error) {
      await this.updateNotificationStatus(message.id, "FAILED", error);
      this.logger.error("Telegram notification failed", {
        context: TelegramService.name,
        function: this.handleTelegramNotification.name,
        data: JSON.stringify(message),
        error: error.message,
      });
    }
  }

  private async updateNotificationStatus(
    notificationId: string,
    status: string,
    error?: string
  ) {
    const me = await this.bot.getMe();
    await this.notificationModel.findOneAndUpdate(
      { _id: notificationId, __v: 1 },
      { status, error, recipient: me.username, __v: 2 }
    );
  }
}
