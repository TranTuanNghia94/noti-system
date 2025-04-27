import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';


@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  context: any;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'notification-service',
      brokers: [this.configService.get<string>('KAFKA_BROKERS') || 'localhost:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'notification-service-group' });
    this.logger.info('KafkaService initialized', { context: KafkaService.name, function: 'constructor' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    this.logger.info('KafkaService initialized', { context: KafkaService.name, function: this.onModuleInit.name });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    this.logger.info('KafkaService destroyed', { context: KafkaService.name, function: this.onModuleDestroy.name });
  }

  async publish(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });

    this.logger.info(`Published message to topic: ${topic}`, { context: KafkaService.name, function: this.publish.name });
  }

  async subscribe(topic: string, callback: (message: any) => Promise<void>) {
    this.logger.info(`Subscribed to topic: ${topic}`, { context: KafkaService.name, function: this.subscribe.name });
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (value) {
          this.logger.info(`Subscribed value [${topic}]: ${value}`, { context: KafkaService.name, function: this.subscribe.name });

          await callback(JSON.parse(value));
        }
      },
    });
  }
} 