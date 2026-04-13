import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Calendar } from './entities/calendar.entity';
import { CreateCalendarDto, UpdateCalendarDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Injectable()
export class CalendarService extends BaseServiceCRUD<
Calendar,
CreateCalendarDto,
UpdateCalendarDto> {
  constructor(
    @InjectRepository(Calendar)
    private readonly repository: Repository<Calendar>,
  ) {
    super(repository)
  }

  override async findAllItems() {
    return super.findAllItems();
  }

  override async create(createDto: CreateCalendarDto) {
    return super.create(createDto);
  }



  override async update(updateDto: UpdateCalendarDto) {
    return super.update(updateDto);
  }

  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}