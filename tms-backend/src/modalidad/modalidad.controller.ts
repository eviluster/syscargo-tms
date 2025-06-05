import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateModalidadDto, UpdateModalidadDto } from './dto';
import { ModalidadService } from './modalidad.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('modalidad')
@Controller('modalidad')
export class ModalidadController extends BaseControllerCRUD<
CreateModalidadDto,
UpdateModalidadDto,
ModalidadService
> {
  constructor(private readonly Service: ModalidadService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreateModalidadDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdateModalidadDto) {
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