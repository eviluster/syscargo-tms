import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { TipoUmService } from './tipo-um.service';
import { CreateTipoUmDto } from './dto/create-tipo-um.dto';
import { UpdateTipoUmDto } from './dto/update-tipo-um.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReturnDto } from '../common/base/dto';
import { SearchDto } from 'src/common/base/dto/search.dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';
import { SearchManyDto } from 'src/common/base/dto/search.many.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { SearchTipoUnidadMedidaDto } from './dto/search-tipo-unidad-medida.dto';

@ApiTags('Tipos-um')
@Controller('tipos-um')
export class TipoUmController  extends BaseControllerCRUD<
CreateTipoUmDto,
UpdateTipoUmDto,
TipoUmService
> {
  constructor(private readonly Service: TipoUmService) {
    super(Service);
  }
  
  @Get('search-by-field')
  async searchByField(@Body() searchDto: SearchTipoUnidadMedidaDto): Promise<ReturnDto> {
    return await this.Service.searchByField(searchDto);
  }
}
