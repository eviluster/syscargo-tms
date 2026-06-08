import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipotransporte } from './entities/tipotransporte.entity';
import { TipotransporteService } from './tipotransporte.service';
import { TipotransporteController } from './tipotransporte.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tipotransporte])
  ],
  controllers: [TipotransporteController],
  providers: [TipotransporteService],
  exports: [TipotransporteService]
})
export class TipotransporteModule {}
