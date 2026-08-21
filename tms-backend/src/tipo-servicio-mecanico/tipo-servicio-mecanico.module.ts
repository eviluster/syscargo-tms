import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoServicioMecanicoService } from './tipo-servicio-mecanico.service';
import { TipoServicioMecanicoController } from './tipo-servicio-mecanico.controller';
import { TipoServicioMecanico } from './entities/tipo-servicio-mecanico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoServicioMecanico])],
  controllers: [TipoServicioMecanicoController],
  providers: [TipoServicioMecanicoService],
  exports: [TipoServicioMecanicoService],
})
export class TipoServicioMecanicoModule {}
