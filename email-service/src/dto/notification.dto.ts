import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsObject, IsOptional } from 'class-validator';

export enum NotificationType {
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  SMS = 'sms',
}

export class NotificationDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  channel: NotificationType;

  @ApiProperty()
  @IsString()
  recipient: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  message: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 