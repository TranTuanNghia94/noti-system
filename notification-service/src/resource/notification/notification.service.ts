import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { KafkaService } from '../kafka/kafka.service';
import { v4 as uuid } from 'uuid';
import { KAFKA_TOPICS, NOTIFICATION_STATUS } from 'src/constants/notification.constant';
import { CreateNotificationDto } from 'src/dto/create-notification.dto';
import { Notification } from 'src/schemas/notification.schema';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ResponseNotificationDto, ResponseRequestDto } from 'src/dto/response-notification.dto';


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

  private log(message: string, level: 'info' | 'error' = 'info', functionName: string) {
    this.logger[level](message, { context: this.context, function: functionName });
  }

  async send(createNotificationDto: CreateNotificationDto): Promise<ResponseRequestDto> {
    const requestId = uuid();
    const notification = await this.notificationModel.create({
      requestId,
      ...createNotificationDto,
    });

    this.log(`Notification created: ${notification.requestId}`, 'info', this.send.name);

    await this.kafkaService.publish(KAFKA_TOPICS[createNotificationDto.channel], {
      id: notification._id,
      requestId,
      status: NOTIFICATION_STATUS.PENDING,
      ...createNotificationDto,
    });
    return new ResponseRequestDto(requestId);
  }

  async findOne(id: string): Promise<ResponseNotificationDto> {
    this.log(`Finding notification: ${id}`, 'info', this.findOne.name);
    const notification = await this.notificationModel.findOne({ requestId: id }).exec();
    if (!notification) {
      this.log(`Notification not found: ${id}`, 'error', this.findOne.name);
      throw new NotFoundException('Notification not found');
    }

    this.log(`Notification found: ${notification.requestId}`, 'info', this.findOne.name);
    return new ResponseNotificationDto(notification);
  }
} 