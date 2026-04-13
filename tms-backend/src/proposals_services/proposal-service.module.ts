import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalService } from './entities/proposal-service.entity';
import { ProposalsServicesService } from './proposal-service.service';
import { ProposalsServicesController } from './proposal-service.controller';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/entities/notification.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProposalService,
      Solicitud,
      Prestatario,
      Notification,
      User,
    ]),
  ],
  controllers: [ProposalsServicesController],
  providers: [ProposalsServicesService, NotificationsService],
  exports: [ProposalsServicesService],
})
export class ProposalsServicesModule {}
