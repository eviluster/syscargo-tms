import { Module } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';
import { MunicipalityController } from './municipality.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipality } from './entities/municipality.entity';
import { ProvinceModule } from 'src/province/province.module';

@Module({
  imports: [TypeOrmModule.forFeature([Municipality]),
  ProvinceModule],
  controllers: [MunicipalityController],
  providers: [MunicipalityService],
  exports: [MunicipalityService],
})
export class MunicipalityModule {}
