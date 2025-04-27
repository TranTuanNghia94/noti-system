import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './resource/email/email.module';
import { KafkaModule } from './resource/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './resource/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    EmailModule,
    KafkaModule,
    LoggerModule
  ],
})
export class AppModule {} 