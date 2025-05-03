import { IsEnum, IsString, IsObject, IsOptional } from 'class-validator';

export enum NotificationType {
  EMAIL = 'email',
  TELEGRAM = 'telegram'
}

export class NotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  recipient: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  message: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 