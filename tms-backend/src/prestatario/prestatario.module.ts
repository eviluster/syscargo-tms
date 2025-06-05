import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestatario } from './entities/prestatario.entity';
import { PrestatarioService } from './prestatario.service';
import { PrestatarioController } from './prestatario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestatario])
  ],
  controllers: [PrestatarioController],
  providers: [PrestatarioService],
  exports: [PrestatarioService]
})
export class PrestatarioModule {}
