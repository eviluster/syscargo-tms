import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TallerServicioService } from './taller-servicio.service';
import { CreateTallerServicioDto, UpdateTallerServicioDto } from './dto/taller-servicio.dto';

@Controller('taller-servicios')
export class TallerServicioController {
  constructor(
    private readonly tallerServicioService: TallerServicioService,
  ) {}

  @Post()
  create(@Body() dto: CreateTallerServicioDto) {
    return this.tallerServicioService.create(dto);
  }

  @Get()
  findAll(@Query('prestatarioId') prestatarioId?: string) {
    return this.tallerServicioService.findAll(prestatarioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tallerServicioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTallerServicioDto,
  ) {
    return this.tallerServicioService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tallerServicioService.remove(id);
  }
}