import { Controller, Get, Post, Body, Param, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from 'src/dto/create-notification.dto';
import { ApiKeyAuthGuard } from 'src/auth/api-key-auth.guard';
import { Notification } from 'src/schemas/notification.schema';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(ApiKeyAuthGuard)
@ApiBearerAuth('api-key')
export class NotificationController {
  protected context: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly notificationService: NotificationService) {
    this.context = this.constructor.name;
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Send a new notification' })
  @ApiResponse({ status: 200, description: 'The notification has been sent.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async send(@Body() createNotificationDto: CreateNotificationDto) {
    this.logger.info(`Sending notification: ${JSON.stringify(createNotificationDto)}`, { context: this.context, function: this.send.name });
    return this.notificationService.send(createNotificationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by id' })
  @ApiResponse({ status: 200, description: 'Return the notification.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async findOne(@Param('id') id: string): Promise<Notification> {
    this.logger.info(`Getting notification: ${id}`, { context: this.context, function: this.findOne.name });
    return this.notificationService.findOne(id);
  }

} 