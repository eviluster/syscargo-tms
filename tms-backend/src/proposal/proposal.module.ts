// src/proposal/proposals.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Proposal } from './entities/proposal.entity';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';

import { Carga } from 'src/carga/entities/carga.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { Peticion } from 'src/peticion/entities/peticion.entity';

// NotificationsModule exporta NotificationsService — si en tu proyecto tiene otro nombre
// ajusta la ruta/import en consecuencia.
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    // registrar aquí todas las entidades cuyos repositorios se inyectan en ProposalService
    TypeOrmModule.forFeature([Proposal, Carga, Prestatario, Peticion]),
    // asegurarnos de que NotificationsService esté registrado
    NotificationsModule,
  ],
  controllers: [ProposalController],
  providers: [ProposalService],
  exports: [ProposalService],
})
export class ProposalsModule {}
