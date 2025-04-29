import { Controller, Get, Post, Body, Param, UseGuards, HttpCode, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from 'src/dto/create-notification.dto';
import { ApiKeyAuthGuard } from 'src/auth/api-key-auth.guard';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NotificationValidator } from '../validator/noti';
import { ResponseNotificationDto } from 'src/dto/response-notification.dto';
import { ApiResponses, ApiResponseDecorator } from './notification.api';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(ApiKeyAuthGuard)
@ApiBearerAuth('api-key')
export class NotificationController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly validator: NotificationValidator,
    private readonly service: NotificationService
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Send a new notification' })
  @ApiResponseDecorator(ApiResponses.send)
  async send(@Body() createNotificationDto: CreateNotificationDto) {
    this.logger.info('Sending notification', { data: createNotificationDto });
    this.validator.validateNotification(createNotificationDto);
    return this.service.send(createNotificationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by id' })
  @ApiResponseDecorator(ApiResponses.get)
  async findOne(@Param('id') id: string): Promise<ResponseNotificationDto> {
    this.logger.info('Getting notification', { id });
    return this.service.findOne(id);
  }
} 