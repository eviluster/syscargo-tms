import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Planes } from './entities/planes.entity';
import { CreatePlanesDto, UpdatePlanesDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class PlanesService extends BaseServiceCRUD<
Planes,
CreatePlanesDto,
UpdatePlanesDto> {
  constructor(
    @InjectRepository(Planes)
    private readonly repository: Repository<Planes>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreatePlanesDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdatePlanesDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}