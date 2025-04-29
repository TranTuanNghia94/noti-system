import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsObject, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export enum NotificationType {
  EMAIL = 'email',
  TELEGRAM = 'telegram'
}

export class CreateNotificationDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  channel: NotificationType;

  @ApiProperty()
  @IsOptional()
  recipient?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'message is required' })
  message: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 