import { Module } from '@nestjs/common';
import { PlanServicioPrestatarioService } from './plan-servicio-prestatario.service';
import { PlanServicioPrestatarioController } from './plan-servicio-prestatario.controller';
import { PlanServicioPrestatario } from './entities/plan-servicio-prestatario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PlanServicioPrestatario])],
  controllers: [PlanServicioPrestatarioController],
  providers: [PlanServicioPrestatarioService],
  exports: [PlanServicioPrestatarioService],
})
export class PlanServicioPrestatarioModule {}
