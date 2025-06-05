import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReturnDto } from '../common/base/dto';
import { SearchManyDto } from 'src/common/base/dto/search.many.dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@ApiTags('country')
@Controller('country')
export class CountryController {
  constructor(private readonly service: CountryService) {}

  @Post()
  async create(@Body() createCountryDto: CreateCountryDto): Promise<ReturnDto> {
    return this.service.create(createCountryDto);
  }
  @Get()
  async search(searchDto: SearchManyDto): Promise<ReturnDto> {
    return this.service.search(searchDto);
  }

  @Patch()
  async update(@Body() updateCountryDto: UpdateCountryDto): Promise<ReturnDto> {
    return this.service.update(updateCountryDto);
  }

  @Delete()
  async remove(@Body() deleteMarcaDto: UpdateCountryDto) {
    return null;
  }

  @Put()
  async active(@Body() dto: DeleteDto) {
    return this.service.active(dto);
  }
}
