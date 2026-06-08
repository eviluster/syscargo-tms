import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalAlquiler } from './entities/proposal-alquiler.entity';
import { ProposalsAlquilerService } from './proposal-alquiler.service';
import { ProposalsAlquilerController } from './proposal-alquiler.controller';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProposalAlquiler, Solicitud, Prestatario]),
    NotificationsModule,
  ],
  providers: [ProposalsAlquilerService],
  controllers: [ProposalsAlquilerController],
})
export class ProposalsAlquilerModule {}
