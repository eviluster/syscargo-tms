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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  /* ===================== SEGURO: UPLOAD FACTURA ===================== */

  @Post(':id/factura')
  @UseInterceptors(
    FileInterceptor('factura', {
      storage: diskStorage({
        destination: './uploads/facturas',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(new BadRequestException('Solo se permiten archivos PDF'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFactura(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo PDF');
    }

    const facturaUrl = `/uploads/facturas/${file.filename}`;

    await this.solicitudesService.update(id, { factura_url: facturaUrl });

    return { url: facturaUrl, message: 'Factura subida correctamente' };
  }
}
