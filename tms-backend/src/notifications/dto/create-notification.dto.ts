import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  meta?: any;

  @IsNotEmpty()
  @IsUUID()
  userTargetId: string;

  @IsOptional()
  @IsUUID()
  userOriginId?: string;
}
