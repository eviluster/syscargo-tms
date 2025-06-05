import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateCargaDto, UpdateCargaDto } from './dto';
import { CargaService } from './carga.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('carga')
@Controller('carga')
export class CargaController extends BaseControllerCRUD<
CreateCargaDto,
UpdateCargaDto,
CargaService
> {
  constructor(private readonly Service: CargaService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

  @Post()
  override async create(createDto:CreateCargaDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdateCargaDto) {
    return super.update(updateDto);
  }

  @Delete()
  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  @Put('active')
  @Put('active')
  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}