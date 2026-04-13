// src/solicitudes/solicitudes.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitudes.dto';
import { UpdateSolicitudDto } from './dto/update-solicitudes.dto';
import { Solicitud, SolicitudStatus } from './solicitudes.entity';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() dto: CreateSolicitudDto): Promise<Solicitud> {
    return this.solicitudesService.create(dto);
  }

  // ahora acepta filtros: cliente_id, serviceRequested, createdByPrestatarioId
  @Get()
  findAll(
    @Query('cliente_id') cliente_id?: string,
    @Query('serviceRequested') serviceRequested?: string,
    @Query('createdByPrestatarioId') createdByPrestatarioId?: string,
  ): Promise<Solicitud[]> {
    return this.solicitudesService.findAll({
      cliente_id,
      serviceRequested,
      createdByPrestatarioId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Solicitud> {
    return this.solicitudesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSolicitudDto,
  ): Promise<Solicitud> {
    return this.solicitudesService.update(id, dto);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: SolicitudStatus,
  ): Promise<Solicitud> {
    return this.solicitudesService.changeStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.solicitudesService.remove(id);
  }
}
