import { BadRequestException, Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { CreateNotificationDto, NotificationType } from "src/dto/create-notification.dto";
import { Logger } from "winston";

export class NotificationValidator {
    private readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    private readonly MAX_LENGTH = 100;

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    private validateEmailNotification(notification: CreateNotificationDto) {
        const { recipient, subject } = notification;
        
        if (!recipient || !this.EMAIL_REGEX.test(recipient) || recipient.length > this.MAX_LENGTH) {
            this.throwValidationError('Invalid recipient email');
        }

        if (!subject || subject.length > this.MAX_LENGTH) {
            this.throwValidationError('Invalid subject');
        }
    }

    private throwValidationError(message: string) {
        this.logger.error(message, {
            context: NotificationValidator.name,
            function: this.validateNotification.name
        });
        throw new BadRequestException(message);
    }

    validateNotification(notification: CreateNotificationDto) {
        if (notification.channel === NotificationType.EMAIL) {
            this.validateEmailNotification(notification);
        }
        return true;
    }
}
