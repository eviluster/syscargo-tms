import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Modalidad } from './entities/modalidad.entity';
import { CreateModalidadDto, UpdateModalidadDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class ModalidadService extends BaseServiceCRUD<
Modalidad,
CreateModalidadDto,
UpdateModalidadDto> {
  constructor(
    @InjectRepository(Modalidad)
    private readonly repository: Repository<Modalidad>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateModalidadDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateModalidadDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}