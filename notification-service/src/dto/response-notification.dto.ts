import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { Notification } from "src/schemas/notification.schema";


export class ResponseNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  error: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  constructor(notification: Notification) {
    this.requestId = notification.requestId;
    this.channel = notification.channel;
    this.recipient = notification.recipient;
    this.message = notification.message;
    this.status = notification.status;
    this.subject = notification.subject;
    this.error = notification?.error;
    this.createdAt = notification.createdAt.toISOString();
    this.updatedAt = notification.updatedAt.toISOString();
  }
}


export class ResponseRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    requestId: string;    

    constructor(requestId: string) {
        this.requestId = requestId;
    }
}