import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateDoccargaDto, UpdateDoccargaDto } from './dto';
import { DoccargaService } from './doccarga.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('doccarga')
@Controller('doccarga')
export class DoccargaController extends BaseControllerCRUD<
CreateDoccargaDto,
UpdateDoccargaDto,
DoccargaService
> {
  constructor(private readonly Service: DoccargaService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreateDoccargaDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdateDoccargaDto) {
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