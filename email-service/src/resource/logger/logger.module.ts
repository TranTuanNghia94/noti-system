import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './logger.config';
import { Logger } from 'winston';
@Module({
  imports: [WinstonModule.forRoot(loggerConfig)],
  exports: [WinstonModule],
  providers: [Logger],
})
export class LoggerModule {} 