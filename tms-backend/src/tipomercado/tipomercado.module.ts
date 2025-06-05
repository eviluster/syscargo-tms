import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipomercado } from './entities/tipomercado.entity';
import { TipomercadoService } from './tipomercado.service';
import { TipomercadoController } from './tipomercado.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tipomercado])
  ],
  controllers: [TipomercadoController],
  providers: [TipomercadoService],
  exports: [TipomercadoService]
})
export class TipomercadoModule {}
