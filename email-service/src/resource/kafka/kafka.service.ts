import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'email-service',
      brokers: [this.configService.get<string>('KAFKA_BROKERS') || 'localhost:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'email-service' });
    this.logger.info("Kafka Service initialized", {
      context: KafkaService.name,
      function: this.constructor.name,
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    this.logger.info("Kafka Service connected to producer and consumer", {
      context: KafkaService.name,
      function: this.onModuleInit.name,
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    this.logger.info("Kafka Service disconnected from producer and consumer", {
      context: KafkaService.name,
      function: this.onModuleDestroy.name,
    });
  }

  async publish(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    this.logger.info("Kafka Service published message to topic", {
      context: KafkaService.name,
      function: this.publish.name,
      data: JSON.stringify(message),
    });
  }

  async subscribe(topic: string, callback: (message: any) => Promise<void>) {
    this.logger.info(`Kafka Service subscribing to topic: ${topic}`, {
      context: KafkaService.name,
      function: this.subscribe.name,
    });
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (value) {
          this.logger.info("Kafka Service received message from topic", {
            context: KafkaService.name,
            function: this.subscribe.name,
            data: JSON.stringify(value),
          });
          await callback(JSON.parse(value));
        }
      },
    });
  }
} 