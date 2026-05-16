import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestatarioserv } from './entities/prestatarioserv.entity';
import { PrestatarioservService } from './prestatarioserv.service';
import { PrestatarioservController } from './prestatarioserv.controller';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { Servicio } from 'src/servicio/entities/servicio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestatarioserv, Prestatario, Servicio])
  ],
  controllers: [PrestatarioservController],
  providers: [PrestatarioservService],
  exports: [PrestatarioservService]
})
export class PrestatarioservModule {}
