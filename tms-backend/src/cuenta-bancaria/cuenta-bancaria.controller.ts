import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CuentaBancariaService } from './cuenta-bancaria.service';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { UpdateCuentaBancariaDto } from './dto/update-cuenta-bancaria.dto';
import { ReturnDto } from 'src/common/base/dto/return.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { SearchCuentaBancariaDto } from './dto/search-cuenta-bancaria.dto';

@Controller('cuenta-bancaria')
export class CuentaBancariaController extends BaseControllerCRUD<
CreateCuentaBancariaDto,
UpdateCuentaBancariaDto,
CuentaBancariaService
> {
  constructor(private readonly Service: CuentaBancariaService) {
    super(Service);
  }
  
  @Get('search-by-field')
  async searchByField(@Body() searchDto: SearchCuentaBancariaDto): Promise<ReturnDto> {
    return await this.Service.searchByField(searchDto);
  }
}
