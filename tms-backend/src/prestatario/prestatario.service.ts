import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Prestatario } from './entities/prestatario.entity';
import { CreatePrestatarioDto, UpdatePrestatarioDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class PrestatarioService extends BaseServiceCRUD<
Prestatario,
CreatePrestatarioDto,
UpdatePrestatarioDto> {
  constructor(
    @InjectRepository(Prestatario)
    private readonly repository: Repository<Prestatario>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreatePrestatarioDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdatePrestatarioDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}