import {
  Controller,
  Get,
  Body,
} from '@nestjs/common';
import { MunicipalityService } from './municipality.service';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { SearchMunicipalityDto } from './dto/search-municipality.dto';
import { ReturnDto } from 'src/common/base/dto';

@Controller('municipality')
export class MunicipalityController extends BaseControllerCRUD<
CreateMunicipalityDto,
UpdateMunicipalityDto,
MunicipalityService
> {
  constructor(private readonly Service: MunicipalityService) {
    super(Service);
  }
  
  @Get('search-by-field')
  async searchByField(@Body() searchDto: SearchMunicipalityDto): Promise<ReturnDto> {
    return await this.Service.searchByField(searchDto);
  }
}
