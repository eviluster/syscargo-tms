import { Injectable } from '@nestjs/common';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService extends BaseServiceCRUD<Notification,CreateNotificationDto,UpdateNotificationDto> {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {
    super(repository)
  }
}