import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';

@Controller('servicio')
export class ServicioController extends BaseControllerCRUD<
CreateServicioDto,
UpdateServicioDto,
ServicioService
> {
  constructor(private readonly Service: ServicioService) {
    super(Service);
  }
  
  // @Get('search-by-field')
  // async searchByField(@Body() searchDto: SearchEngineDto): Promise<ReturnDto> {
  //   return await this.Service.searchByField(searchDto);
  // }
}