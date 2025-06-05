import { Module } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Reserva } from 'src/reserva/entities/reserva.entity';
import { ReservaModule } from 'src/reserva/reserva.module';
import { ConfiguracionModule } from 'src/configuracion/configuracion.module';
import { Configuracion } from 'src/configuracion/entities/configuracion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago,Reserva,Configuracion]),
  ReservaModule,
  ConfiguracionModule],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [PagoService],
})
export class PagoModule {}
