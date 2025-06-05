import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComercialService } from './comercial.service';
import { CreateComercialDto } from './dto/create-comercial.dto';
import { UpdateComercialDto } from './dto/update-comercial.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ReturnDto } from 'src/common/base/dto';
import { SearchDto } from 'src/common/base/dto/search.dto';
import { SearchComercialDto } from './dto/search-comercial.dto';

@Controller('comercial')
export class ComercialController extends BaseControllerCRUD<
CreateComercialDto,
UpdateComercialDto,
ComercialService
> {
  constructor(private readonly Service: ComercialService) {
    super(Service);
  }
  
  @Get('search-by-field')
  async searchByField(@Body() searchDto: SearchComercialDto): Promise<ReturnDto> {
    return await this.Service.searchByField(searchDto);
  }
}
