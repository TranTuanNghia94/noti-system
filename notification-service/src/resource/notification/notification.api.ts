import { ApiResponse } from '@nestjs/swagger';
import { ResponseNotificationDto, ResponseRequestDto } from 'src/dto/response-notification.dto';

const baseResponses = [
  { status: 401, description: 'Unauthorized' },
  { status: 403, description: 'Forbidden' },
  { status: 500, description: 'Server error' }
];

export const ApiResponses = {
  send: [
    { status: 200, description: 'Notification sent successfully', type: ResponseRequestDto },
    { status: 400, description: 'Invalid request data' },
    ...baseResponses
  ],
  get: [
    { status: 200, description: 'Notification retrieved successfully', type: ResponseNotificationDto },
    { status: 404, description: 'Notification not found' },
    ...baseResponses
  ]
};

export function ApiResponseDecorator(responses: typeof ApiResponses.send | typeof ApiResponses.get) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    responses.forEach(response => {
      ApiResponse(response)(target, propertyKey, descriptor);
    });
    return descriptor;
  };
} 