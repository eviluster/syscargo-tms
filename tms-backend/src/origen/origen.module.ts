import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Origen } from './entities/origen.entity';
import { OrigenService } from './origen.service';
import { OrigenController } from './origen.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Origen])
  ],
  controllers: [OrigenController],
  providers: [OrigenService],
  exports: [OrigenService]
})
export class OrigenModule {}
