import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Carga } from './entities/carga.entity';
import { CreateCargaDto, UpdateCargaDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class CargaService extends BaseServiceCRUD<
Carga,
CreateCargaDto,
UpdateCargaDto> {
  constructor(
    @InjectRepository(Carga)
    private readonly repository: Repository<Carga>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateCargaDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateCargaDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}