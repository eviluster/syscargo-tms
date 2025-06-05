import { Module } from '@nestjs/common';
import { PlanServicioClienteService } from './plan-servicio-cliente.service';
import { PlanServicioClienteController } from './plan-servicio-cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanServicioCliente } from './entities/plan-servicio-cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanServicioCliente])],
  controllers: [PlanServicioClienteController],
  providers: [PlanServicioClienteService],
  exports: [PlanServicioClienteService],
})
export class PlanServicioClienteModule {}
