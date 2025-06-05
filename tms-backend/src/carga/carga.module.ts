import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carga } from './entities/carga.entity';
import { CargaService } from './carga.service';
import { CargaController } from './carga.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carga])
  ],
  controllers: [CargaController],
  providers: [CargaService],
  exports: [CargaService]
})
export class CargaModule {}
