import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlanesDto, UpdatePlanesDto } from './dto';
import { PlanesService } from './planes.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('planes')
@Controller('planes')
export class PlanesController extends BaseControllerCRUD<
CreatePlanesDto,
UpdatePlanesDto,
PlanesService
> {
  constructor(private readonly Service: PlanesService) {
    super(Service);
  }
  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreatePlanesDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdatePlanesDto) {
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
