import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreatePrestatarioDto, UpdatePrestatarioDto } from './dto';
import { PrestatarioService } from './prestatario.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('prestatario')
@Controller('prestatario')
export class PrestatarioController extends BaseControllerCRUD<
CreatePrestatarioDto,
UpdatePrestatarioDto,
PrestatarioService
> {
  constructor(private readonly Service: PrestatarioService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreatePrestatarioDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdatePrestatarioDto) {
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