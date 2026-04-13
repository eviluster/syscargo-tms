import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Tipopago } from './entities/tipopago.entity';
import { CreateTipopagoDto, UpdateTipopagoDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class TipopagoService extends BaseServiceCRUD<
Tipopago,
CreateTipopagoDto,
UpdateTipopagoDto> {
  constructor(
    @InjectRepository(Tipopago)
    private readonly repository: Repository<Tipopago>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto:CreateTipopagoDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateTipopagoDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}