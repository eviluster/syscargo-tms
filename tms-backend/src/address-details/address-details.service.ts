import { Injectable } from '@nestjs/common';
import { CreateAddressDetailDto } from './dto/create-address-detail.dto';
import { UpdateAddressDetailDto } from './dto/update-address-detail.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { AddressDetail } from './entities/address-detail.entity';

@Injectable()
export class AddressDetailsService extends BaseServiceCRUD<
AddressDetail,
CreateAddressDetailDto,
UpdateAddressDetailDto> {
  constructor(
    @InjectRepository(AddressDetail)
    private readonly repository: Repository<AddressDetail>,
  ) {
    super(repository)
  }
}
