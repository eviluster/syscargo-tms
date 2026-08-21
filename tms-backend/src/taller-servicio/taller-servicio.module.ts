import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TallerServicioService } from './taller-servicio.service';
import { TallerServicioController } from './taller-servicio.controller';
import { TallerServicio } from './entities/taller-servicio.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TallerServicio, Prestatario])],
  controllers: [TallerServicioController],
  providers: [TallerServicioService],
  exports: [TallerServicioService],
})
export class TallerServicioModule {}
