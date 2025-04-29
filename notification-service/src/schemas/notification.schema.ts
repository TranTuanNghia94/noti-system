import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { NotificationType } from "../dto/create-notification.dto";

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true, unique: true, index: true })
  requestId: string;

  @Prop({ required: true, enum: NotificationType })
  channel: NotificationType;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, default: 'PENDING' })
  status: string;

  @Prop({ required: false })
  error?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  subject: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}


export const NotificationSchema = SchemaFactory.createForClass(Notification);
