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
    this.log("Service initialized");
  }

  private log(message: string, data?: any, level: 'info' | 'error' = 'info') {
    const logData = {
      context: TelegramService.name,
      ...(data && { data: JSON.stringify(data) })
    };
    
    if (level === 'info') {
      this.logger.info(message, logData);
    } else {
      this.logger.error(message, logData);
    }
  }

  async onModuleInit() {
    await this.kafkaService.subscribe(
      KAFKA_TOPICS.TELEGRAM_NOTIFICATION,
      this.handleTelegramNotification.bind(this)
    );
    this.log("Service initialized");
  }

  async onModuleDestroy() {
    this.bot.close();
    this.log("Service destroyed");
  }

  private async sendMessage(data: TelegramMessage) {
    const chatId = this.configService.get("TELEGRAM_CHAT_ID");
    this.log("Sending message to Telegram", data);
    await this.bot.sendMessage(chatId, data.message);
  }

  private async handleTelegramNotification(message: TelegramMessage) {
    try {
      await this.sendMessage(message);
      await this.updateNotificationStatus(message.id, "SUCCESS");
      this.log("Telegram notification sent", message);
    } catch (error) {
      await this.updateNotificationStatus(message.id, "FAILED", error);
      this.log("Telegram notification failed", { message, error: error.message }, 'error');
    }
  }

  private async updateNotificationStatus(
    notificationId: string,
    status: string,
    error?: string
  ) {
    const me = await this.bot.getMe();
    await this.notificationModel.findOneAndUpdate(
      { _id: notificationId, __v: 0 },
      { status, error, recipient: me.username, __v: 1 }
    );
  }
}
