import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestatarioserv } from './entities/prestatarioserv.entity';
import { PrestatarioservService } from './prestatarioserv.service';
import { PrestatarioservController } from './prestatarioserv.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestatarioserv])
  ],
  controllers: [PrestatarioservController],
  providers: [PrestatarioservService],
  exports: [PrestatarioservService]
})
export class PrestatarioservModule {}
