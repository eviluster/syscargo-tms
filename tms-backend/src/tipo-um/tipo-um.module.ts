import { Module } from '@nestjs/common';
import { TipoUmService } from './tipo-um.service';
import { TipoUmController } from './tipo-um.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUm } from './entities/tipo-um.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoUm])],
  controllers: [TipoUmController],
  providers: [TipoUmService],
  exports: [TipoUmService],
})
export class TipoUmModule {}
