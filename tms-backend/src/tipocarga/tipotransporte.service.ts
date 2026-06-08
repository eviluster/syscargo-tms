import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Tipotransporte } from './entities/tipotransporte.entity';
import { CreateTipotransporteDto, UpdateTipotransporteDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class TipotransporteService extends BaseServiceCRUD<
Tipotransporte,
CreateTipotransporteDto,
UpdateTipotransporteDto> {
  constructor(
    @InjectRepository(Tipotransporte)
    private readonly repository: Repository<Tipotransporte>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateTipotransporteDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateTipotransporteDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}