import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { SearchProveedorDto } from './dto/search-proveedor.dto';
import { ReturnDto } from 'src/common/base/dto';

@Controller('proveedor')
export class ProveedorController extends BaseControllerCRUD<
CreateProveedorDto,
UpdateProveedorDto,
ProveedorService
> {
  constructor(private readonly Service: ProveedorService) {
    super(Service);
  }
  
  @Get('search-by-field')
  async searchByField(@Body() searchDto: SearchProveedorDto): Promise<ReturnDto> {
    return await this.Service.searchByField(searchDto);
  }
}