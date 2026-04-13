import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Doccarga } from './entities/doccarga.entity';
import { CreateDoccargaDto, UpdateDoccargaDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class DoccargaService extends BaseServiceCRUD<
Doccarga,
CreateDoccargaDto,
UpdateDoccargaDto> {
  constructor(
    @InjectRepository(Doccarga)
    private readonly repository: Repository<Doccarga>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateDoccargaDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateDoccargaDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}