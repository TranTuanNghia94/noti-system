import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './resource/kafka/kafka.module';
import { TelegramModule } from './resource/telegram/telegram.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './resource/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TelegramModule,
    KafkaModule,
    LoggerModule
  ],
})
export class AppModule {} 