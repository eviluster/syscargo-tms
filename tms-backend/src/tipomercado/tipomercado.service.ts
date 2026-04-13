import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Tipomercado } from './entities/tipomercado.entity';
import { CreateTipomercadoDto, UpdateTipomercadoDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class TipomercadoService extends BaseServiceCRUD<
Tipomercado,
CreateTipomercadoDto,
UpdateTipomercadoDto> {
  constructor(
    @InjectRepository(Tipomercado)
    private readonly repository: Repository<Tipomercado>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateTipomercadoDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateTipomercadoDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}