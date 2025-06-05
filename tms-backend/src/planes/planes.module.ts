import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planes } from './entities/planes.entity';
import { PlanesService } from './planes.service';
import { PlanesController } from './planes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Planes])
  ],
  controllers: [PlanesController],
  providers: [PlanesService],
  exports: [PlanesService]
})
export class PlanesModule {}
