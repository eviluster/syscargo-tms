import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';

@Controller('customer')
export class CustomerController  extends BaseControllerCRUD<
CreateCustomerDto,
UpdateCustomerDto,
CustomerService
> {
  constructor(private readonly Service: CustomerService) {
    super(Service);
  }
  
  // @Get('search-by-field')
  // async searchByField(@Body() searchDto: SearchProvinceDto): Promise<ReturnDto> {
  //   return await this.Service.searchByField(searchDto);
  // }
}