import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Destino } from './entities/destino.entity';
import { CreateDestinoDto, UpdateDestinoDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class DestinoService extends BaseServiceCRUD<
Destino,
CreateDestinoDto,
UpdateDestinoDto> {
  constructor(
    @InjectRepository(Destino)
    private readonly repository: Repository<Destino>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateDestinoDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateDestinoDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}