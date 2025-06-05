import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateCalendarDto, UpdateCalendarDto } from './dto';
import { CalendarService } from './calendar.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';


@ApiTags('calendar')
@Controller('calendar')
export class CalendarController extends BaseControllerCRUD<
CreateCalendarDto,
UpdateCalendarDto,
CalendarService
> {
  constructor(private readonly Service: CalendarService) {
    super(Service);
  }

  @Get('all')
  override async findItems() {
    return super.findItems();
  }

    @Post()
  override async create(createDto:CreateCalendarDto) {
    return super.create(createDto);
  }

  @Patch()
  override async update(updateDto: UpdateCalendarDto) {
    return super.update(updateDto);
  }

  @Delete()
  override async remove(deleteDto: DeleteDto) {
    return super.remove(deleteDto);
  }

  @Put('active')
  override async active(dto: DeleteDto) {
    return super.active(dto);
  }
}