import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerCuentaService } from './customer-cuenta.service';
import { CreateCustomerCuentaDto } from './dto/create-customer-cuenta.dto';
import { UpdateCustomerCuentaDto } from './dto/update-customer-cuenta.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';

@Controller('customer-cuenta')
export class CustomerCuentaController  extends BaseControllerCRUD<
CreateCustomerCuentaDto,
UpdateCustomerCuentaDto,
CustomerCuentaService
> {
  constructor(private readonly Service: CustomerCuentaService) {
    super(Service);
  }
  
  // @Get('search-by-field')
  // async searchByField(@Body() searchDto: SearchEngineDto): Promise<ReturnDto> {
  //   return await this.Service.searchByField(searchDto);
  // }
}
