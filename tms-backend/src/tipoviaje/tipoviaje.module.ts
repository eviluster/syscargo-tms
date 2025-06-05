import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipoviaje } from './entities/tipoviaje.entity';
import { TipoviajeService } from './tipoviaje.service';
import { TipoviajeController } from './tipoviaje.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tipoviaje])
  ],
  controllers: [TipoviajeController],
  providers: [TipoviajeService],
  exports: [TipoviajeService]
})
export class TipoviajeModule {}
