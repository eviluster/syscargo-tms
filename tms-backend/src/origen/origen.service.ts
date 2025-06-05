import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Origen } from './entities/origen.entity';
import { CreateOrigenDto, UpdateOrigenDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class OrigenService extends BaseServiceCRUD<
Origen,
CreateOrigenDto,
UpdateOrigenDto> {
  constructor(
    @InjectRepository(Origen)
    private readonly repository: Repository<Origen>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateOrigenDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateOrigenDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}