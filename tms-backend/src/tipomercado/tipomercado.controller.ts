import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateTipomercadoDto, UpdateTipomercadoDto } from './dto';
import { TipomercadoService } from './tipomercado.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('tipomercado')
@Controller('tipomercado')
export class TipomercadoController extends BaseControllerCRUD<
CreateTipomercadoDto,
UpdateTipomercadoDto,
TipomercadoService
> {
  constructor(private readonly Service: TipomercadoService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreateTipomercadoDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdateTipomercadoDto) {
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