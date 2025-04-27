import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationType } from '../dto/notification.dto';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true, unique: true })
  requestId: string;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  recipient: string;

  @Prop()
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true})
  status: string;

  @Prop()
  error?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification); 