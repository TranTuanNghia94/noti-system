import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsObject, IsOptional, IsEmail } from 'class-validator';

export enum NotificationType {
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  SMS = 'sms',
}

export class CreateNotificationDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  channel: NotificationType;

  @ApiProperty()
  @IsEmail()
  recipient: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subject: string;

  @ApiProperty()
  @IsString()
  message: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 