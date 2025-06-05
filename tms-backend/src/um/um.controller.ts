import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { UmService } from './um.service';
import { CreateUmDto } from './dto/create-um.dto';
import { UpdateUmDto } from './dto/update-um.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReturnDto } from '../common/base/dto';
import { SearchDto } from 'src/common/base/dto/search.dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';
import { SearchManyDto } from 'src/common/base/dto/search.many.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { SearchUmDto } from './dto/search-um.dto';

@ApiTags('ums')
@Controller('um')
export class UmController  extends BaseControllerCRUD<
CreateUmDto,
UpdateUmDto,
UmService
> {
  constructor(private readonly Service: UmService) {
    super(Service);
  }
  
  @Get('search-by-field')
  async searchByField(@Body() searchDto: SearchUmDto): Promise<ReturnDto> {
    return await this.Service.searchByField(searchDto);
  }
}
