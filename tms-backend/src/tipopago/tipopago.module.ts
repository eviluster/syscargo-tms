import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipopago } from './entities/tipopago.entity';
import { TipopagoService } from './tipopago.service';
import { TipopagoController } from './tipopago.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tipopago])
  ],
  controllers: [TipopagoController],
  providers: [TipopagoService],
  exports: [TipopagoService]
})
export class TipopagoModule {}
