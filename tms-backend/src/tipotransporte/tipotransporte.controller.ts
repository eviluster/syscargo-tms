import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateTipotransporteDto, UpdateTipotransporteDto } from './dto';
import { TipotransporteService } from './tipotransporte.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('tipotransporte')
@Controller('tipotransporte')
export class TipotransporteController extends BaseControllerCRUD<
CreateTipotransporteDto,
UpdateTipotransporteDto,
TipotransporteService
> {
  constructor(private readonly Service: TipotransporteService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreateTipotransporteDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdateTipotransporteDto) {
    return super.update(updateDto);
  }

  @Delete()
  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  @Put('active')
  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}