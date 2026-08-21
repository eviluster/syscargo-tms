import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaTallerService } from './cita-taller.service';
import { CitaTallerController } from './cita-taller.controller';
import { CitaTaller } from './entities/cita-taller.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { TallerServicio } from 'src/taller-servicio/entities/taller-servicio.entity';
import { AddressDetail } from 'src/address-details/entities/address-detail.entity';
import { Tipocarga } from 'src/tipocarga/entities/tipocarga.entity';
import { Tipotransporte } from 'src/tipotransporte/entities/tipotransporte.entity';
import { TallerHorario } from 'src/taller-horario/entities/taller-horario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CitaTaller,
      Prestatario,
      TallerServicio,
      AddressDetail,
      Tipocarga,
      Tipotransporte,
      TallerHorario,
    ]),
  ],
  controllers: [CitaTallerController],
  providers: [CitaTallerService],
  exports: [CitaTallerService],
})
export class CitaTallerModule {}
