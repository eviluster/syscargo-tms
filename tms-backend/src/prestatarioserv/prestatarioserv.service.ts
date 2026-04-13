import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Prestatarioserv } from './entities/prestatarioserv.entity';
import { CreatePrestatarioservDto, UpdatePrestatarioservDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class PrestatarioservService extends BaseServiceCRUD<
Prestatarioserv,
CreatePrestatarioservDto,
UpdatePrestatarioservDto> {
  constructor(
    @InjectRepository(Prestatarioserv)
    private readonly repository: Repository<Prestatarioserv>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreatePrestatarioservDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdatePrestatarioservDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}