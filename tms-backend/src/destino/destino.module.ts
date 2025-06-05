import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destino } from './entities/destino.entity';
import { DestinoService } from './destino.service';
import { DestinoController } from './destino.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Destino])
  ],
  controllers: [DestinoController],
  providers: [DestinoService],
  exports: [DestinoService]
})
export class DestinoModule {}
