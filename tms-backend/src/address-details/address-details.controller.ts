import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AddressDetailsService } from './address-details.service';
import { CreateAddressDetailDto } from './dto/create-address-detail.dto';
import { UpdateAddressDetailDto } from './dto/update-address-detail.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';

@Controller('address-details')
export class AddressDetailsController extends BaseControllerCRUD<
CreateAddressDetailDto,
UpdateAddressDetailDto,
AddressDetailsService
> {
  constructor(private readonly Service: AddressDetailsService) {
    super(Service);
  }
}
