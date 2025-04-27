import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { KafkaModule } from '../kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema, Notification } from 'src/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),KafkaModule],
  controllers: [],
  providers: [EmailService],
})
export class EmailModule {} 