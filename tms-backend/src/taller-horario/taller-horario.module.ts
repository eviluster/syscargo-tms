import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TallerHorarioService } from './taller-horario.service';
import { TallerHorarioController } from './taller-horario.controller';
import { TallerHorario } from './entities/taller-horario.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TallerHorario, Prestatario])],
  controllers: [TallerHorarioController],
  providers: [TallerHorarioService],
  exports: [TallerHorarioService],
})
export class TallerHorarioModule {}
