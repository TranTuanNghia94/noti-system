import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

interface LoggerContext {
  name?: string;
}

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, context, function: functionName, trace, ...meta }) => {
          const contextName = context ? (typeof context === 'string' ? context : (context as LoggerContext).name) : 'Application';
          return `[Telegram Service] ${timestamp} [${level}] [class: ${contextName}] [function: ${functionName || 'unknown'}] ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }${trace ? `\n${trace}` : ''}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/app.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, context, function: functionName, trace, ...meta }) => {
          const contextName = context ? (typeof context === 'string' ? context : (context as LoggerContext).name) : 'Application';
          return `[Telegram Service] ${timestamp} [${level}] [class: ${contextName}] [function: ${functionName || 'unknown'}] ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }${trace ? `\n${trace}` : ''}`;
        }),
      ),
    }),
  ],
}; 