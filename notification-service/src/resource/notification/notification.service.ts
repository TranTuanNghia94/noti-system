import { Inject, Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { KafkaService } from '../kafka/kafka.service';
import { v4 as uuid } from 'uuid';
import { KAFKA_TOPICS, NOTIFICATION_STATUS } from 'src/constants/notification.constant';
import { CreateNotificationDto } from 'src/dto/create-notification.dto';
import { Notification } from 'src/schemas/notification.schema';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';


@Injectable()
export class NotificationService {
  protected context: string;
  
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectConnection() private connection: Connection,
    private readonly kafkaService: KafkaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.context = this.constructor.name;
  }


  async send(createNotificationDto: CreateNotificationDto): Promise<{ requestId: string }> {
    const requestId = uuid();
    const notification = await this.notificationModel.create({
      requestId,
      ...createNotificationDto,
    });

    this.logger.info(`Notification created: ${notification.requestId}`, { context: this.context, function: this.send.name });

    await this.kafkaService.publish(KAFKA_TOPICS[createNotificationDto.channel], {
      id: notification._id,
      requestId,
      status: NOTIFICATION_STATUS.PENDING,
      ...createNotificationDto,
    });
    return { requestId };
  }

  async findOne(id: string): Promise<Notification> {
    this.logger.info(`Finding notification: ${id}`, { context: this.context, function: this.findOne.name });
    return this.notificationModel.findOne({ requestId: id }).exec();
  }
} 