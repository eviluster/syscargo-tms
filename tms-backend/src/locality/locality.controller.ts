import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocalityService } from './locality.service';
import { CreateLocalityDto } from './dto/create-locality.dto';
import { UpdateLocalityDto } from './dto/update-locality.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';

@Controller('locality')
export class LocalityController extends BaseControllerCRUD<
CreateLocalityDto,
UpdateLocalityDto,
LocalityService
> {
  constructor(private readonly Service: LocalityService) {
    super(Service);
  }
  
  // @Get('search-by-field')
  // async searchByField(@Body() searchDto: SearchEngineDto): Promise<ReturnDto> {
  //   return await this.Service.searchByField(searchDto);
  // }
}