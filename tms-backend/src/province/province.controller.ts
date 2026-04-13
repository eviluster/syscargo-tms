import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProvinceService } from './province.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { SearchProvinceDto } from './dto/search-province.dto';
import { ReturnDto } from 'src/common/base/dto';

@Controller('province')
export class ProvinceController extends BaseControllerCRUD<
CreateProvinceDto,
UpdateProvinceDto,
ProvinceService
> {
  constructor(private readonly Service: ProvinceService) {
    super(Service);
  }
  
  @Get('search-by-field')
  async searchByField(@Body() searchDto: SearchProvinceDto): Promise<ReturnDto> {
    return await this.Service.searchByField(searchDto);
  }
}
