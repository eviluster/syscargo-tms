import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitudes.entity';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';

// Ajusta imports de módulos/entities reales
import { Client } from 'src/cliente/entities/cliente.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { ClientModule } from 'src/cliente/cliente.module';
import { PrestatarioModule } from 'src/prestatario/prestatario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Solicitud, Client, Prestatario]),
    // si tienes módulos que exponen repositorios o servicios:
    forwardRef(() => ClientModule),
    forwardRef(() => PrestatarioModule),
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}
