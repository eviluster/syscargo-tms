import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateTipopagoDto, UpdateTipopagoDto } from './dto';
import { TipopagoService } from './tipopago.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('tipopago')
@Controller('tipopago')
export class TipopagoController extends BaseControllerCRUD<
CreateTipopagoDto,
UpdateTipopagoDto,
TipopagoService
> {
  constructor(private readonly Service: TipopagoService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreateTipopagoDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdateTipopagoDto) {
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