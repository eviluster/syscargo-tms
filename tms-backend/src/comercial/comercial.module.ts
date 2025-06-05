import { Module } from '@nestjs/common';
import { ComercialService } from './comercial.service';
import { ComercialController } from './comercial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comercial } from './entities/comercial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comercial])],
  controllers: [ComercialController],
  providers: [ComercialService],
  exports: [ComercialService],
})
export class ComercialModule {}
