import {
  Controller,
  UseGuards,
  Post,
  Patch,
  Delete,
  Body,
  Put,
  Get,
} from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags } from '@nestjs/swagger';
import { CreateCalendarDto, UpdateCalendarDto } from './dto';
import { CalendarService } from './calendar.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';
import { JwtGuard } from 'src/auth/guard';
import { User } from 'src/user/entities/user.entity';
import { GetUser, GetUserAdmin, GetUserCalendar } from 'src/auth/decorator';
import { ReturnDto } from 'src/common/base/dto';

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

  @UseGuards(JwtGuard)
  @Post()
  override async create(
    createDto: CreateCalendarDto,
    @GetUserCalendar() user: User,
  ) {
    console.log(createDto);
    return super.create(createDto);
  }

  @UseGuards(JwtGuard)
  @Patch()
  override async update(
    updateDto: UpdateCalendarDto,
    @GetUserCalendar() user: User,
  ) {
    return super.update(updateDto);
  }

  @UseGuards(JwtGuard)
  @Delete()
  override remove(
    @Body() deleteDto: DeleteDto,
    @GetUserCalendar() user: User,
  ): Promise<ReturnDto> {
    return null;
  }

  @UseGuards(JwtGuard)
  @Put('active')
  override active(
    @Body() deleteDto: DeleteDto,
    @GetUserCalendar() user: User,
  ): Promise<ReturnDto> {
    return super.active(deleteDto);
  }
}
