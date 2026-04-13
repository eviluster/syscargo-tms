import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doccarga } from './entities/doccarga.entity';
import { DoccargaService } from './doccarga.service';
import { DoccargaController } from './doccarga.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doccarga])
  ],
  controllers: [DoccargaController],
  providers: [DoccargaService],
  exports: [DoccargaService]
})
export class DoccargaModule {}
