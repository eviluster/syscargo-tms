import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Peticion } from './entities/peticion.entity';
import { PeticionService } from './peticion.service';
import { PeticionController } from './peticion.controller';

import { Client } from 'src/cliente/entities/cliente.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { Proposal } from 'src/proposal/entities/proposal.entity';

// Opcional: si tienes un módulo de notificaciones, importa aquí.
// Si no existe, elimina la línea o sustituye por el provider adecuado.
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Peticion, Client, Prestatario, Proposal]),
    // Descomenta si tienes NotificationsModule implementado
    NotificationsModule,
  ],
  controllers: [PeticionController],
  providers: [PeticionService],
  exports: [PeticionService],
})
export class PeticionModule {}
