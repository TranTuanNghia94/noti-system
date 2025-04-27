import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from '../kafka/kafka.service';
import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from 'src/schemas/notification.schema';
import { KAFKA_TOPICS, NOTIFICATION_STATUS } from 'src/constants/resource.constants';
import { EmailMessage } from 'src/interface/notification.interface';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private configService: ConfigService,
    private kafkaService: KafkaService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASS'),
      },
    });

    this.logger.info("Email Service initialized", {
      context: EmailService.name,
      function: this.constructor.name,
    });
  }

  async onModuleInit() {
    await this.kafkaService.subscribe(KAFKA_TOPICS.EMAIL_NOTIFICATION, this.handleEmailNotification.bind(this));
    this.logger.info("Email Service subscribed to Kafka topic", {
      context: EmailService.name,
      function: this.onModuleInit.name,
    });
  }

  onModuleDestroy() {
    this.transporter.close();
    this.logger.info("Email Service destroyed", {
      context: EmailService.name,
      function: this.onModuleDestroy.name,
    });
  }

  private async handleEmailNotification(message: EmailMessage) {
    try {
      await this.sendEmail(message);
      await this.updateNotificationStatus(message.id, NOTIFICATION_STATUS.SUCCESS);
      this.logger.info("Email Service sent email", {
        context: EmailService.name,
        function: this.handleEmailNotification.name,
        data: JSON.stringify(message),
      });
    } catch (error) {
      await this.updateNotificationStatus(message.id, NOTIFICATION_STATUS.FAILED, error.message);
      this.logger.error("Email Service failed to send email", {
        context: EmailService.name,
        function: this.handleEmailNotification.name,
        data: JSON.stringify(message),
        error: error.message,
      });
    }
  }

  private async sendEmail({ recipient, message, subject }: EmailMessage) {
    await this.transporter.sendMail({
      from: this.configService.get<string>('GMAIL_USER'),
      to: recipient,
      subject: subject,
      text: message,
    });
    this.logger.info("Email Service sent email", {
      context: EmailService.name,
      function: this.sendEmail.name,
      data: JSON.stringify(message),
    });
  }

  private async updateNotificationStatus(notificationId: string, status: string, error?: string) {
    await this.notificationModel.findOneAndUpdate(
      { _id: notificationId, __v: 1 },
      { status, error, __v: 2 }
    );
  }
} 