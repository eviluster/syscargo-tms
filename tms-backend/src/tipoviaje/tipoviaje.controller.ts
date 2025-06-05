import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateTipoviajeDto, UpdateTipoviajeDto } from './dto';
import { TipoviajeService } from './tipoviaje.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('tipoviaje')
@Controller('tipoviaje')
export class TipoviajeController extends BaseControllerCRUD<
CreateTipoviajeDto,
UpdateTipoviajeDto,
TipoviajeService
> {
  constructor(private readonly Service: TipoviajeService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreateTipoviajeDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdateTipoviajeDto) {
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