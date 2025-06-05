import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Tipoviaje } from './entities/tipoviaje.entity';
import { CreateTipoviajeDto, UpdateTipoviajeDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class TipoviajeService extends BaseServiceCRUD<
Tipoviaje,
CreateTipoviajeDto,
UpdateTipoviajeDto> {
  constructor(
    @InjectRepository(Tipoviaje)
    private readonly repository: Repository<Tipoviaje>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateTipoviajeDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateTipoviajeDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}