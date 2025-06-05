import { Module } from '@nestjs/common';
import { AddressDetailsService } from './address-details.service';
import { AddressDetailsController } from './address-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressDetail } from './entities/address-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressDetail])],
  controllers: [AddressDetailsController],
  providers: [AddressDetailsService],
  exports: [AddressDetailsService],
})
export class AddressDetailsModule {}
