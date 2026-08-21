import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CitaTallerService } from './cita-taller.service';
import {
  CreateCitaTallerDto,
  CreateCitaEscatolinaDto,
  ResponderCitaDto,
  ActualizarEstadoCitaDto,
  ConsultaDisponibilidadCitasDto,
} from './dto/cita-taller.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { EstadoCita } from './entities/cita-taller.entity';

@ApiTags('citas-taller')
@Controller('citas-taller')
export class CitaTallerController {
  constructor(private readonly citaTallerService: CitaTallerService) {}

  @Post('reservar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reservar una cita en un taller' })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente (estado PENDIENTE)' })
  @ApiResponse({ status: 400, description: 'Bad Request - Horario no disponible o taller no existe' })
  @ApiResponse({ status: 404, description: 'Servicio o cliente no encontrado' })
  reservar(@Body() createDto: CreateCitaTallerDto, @Query('clienteId') clienteId: string) {
    return this.citaTallerService.crearCita(createDto, clienteId);
  }

  @Post('reservar-escatolina')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reservar una cita con servicio de escatolina' })
  @ApiResponse({ status: 201, description: 'Cita con escatolina creada exitosamente' })
  reservarEscatolina(
    @Body() createDto: CreateCitaEscatolinaDto,
    @Query('clienteId') clienteId: string,
  ) {
    return this.citaTallerService.crearCitaEscatolina(createDto, clienteId);
  }

  @Post(':id/aceptar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceptar una cita pendiente' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la cita' })
  aceptar(@Param('id') id: string) {
    return this.citaTallerService.responderCita(id, { estado: EstadoCita.APROBADA });
  }

  @Post(':id/rechazar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rechazar una cita pendiente' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la cita' })
  rechazar(@Param('id') id: string, @Body() dto: { motivo_rechazo: string; notas_adicionales?: string }) {
    return this.citaTallerService.responderCita(id, {
      estado: EstadoCita.RECHAZADA,
      motivo_rechazo: dto.motivo_rechazo,
      notas_adicionales: dto.notas_adicionales,
    });
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar el estado de una cita' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la cita' })
  actualizarEstado(@Param('id') id: string, @Body() dto: ActualizarEstadoCitaDto) {
    return this.citaTallerService.actualizarEstado(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cita por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la cita' })
  findOne(@Param('id') id: string) {
    return this.citaTallerService.findOne(id);
  }

  @Get('taller/:tallerId')
  @ApiOperation({ summary: 'Obtener todas las citas de un taller' })
  @ApiParam({ name: 'tallerId', type: String, description: 'ID del taller' })
  findByTaller(@Param('tallerId') tallerId: string) {
    return this.citaTallerService.findByTaller(tallerId);
  }

  @Get('cliente/:clienteId')
  @ApiOperation({ summary: 'Obtener todas las citas de un cliente' })
  @ApiParam({ name: 'clienteId', type: String, description: 'ID del cliente' })
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.citaTallerService.findByCliente(clienteId);
  }

  @Get('taller/:tallerId/estado/:estado')
  @ApiOperation({ summary: 'Obtener citas de un taller por estado' })
  @ApiParam({ name: 'tallerId', type: String, description: 'ID del taller' })
  @ApiParam({ name: 'estado', enum: EstadoCita, description: 'Estado de las citas' })
  findByEstado(@Param('tallerId') tallerId: string, @Param('estado') estado: EstadoCita) {
    return this.citaTallerService.findByEstado(tallerId, estado);
  }

  @Get('disponibilidad')
  @ApiOperation({ summary: 'Consultar disponibilidad de slots para un taller' })
  @ApiQuery({ name: 'tallerId', type: String, description: 'ID del taller' })
  @ApiQuery({ name: 'fecha_inicio', type: String, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fecha_fin', type: String, description: 'Fecha fin (YYYY-MM-DD)' })
  consultarDisponibilidad(@Query() dto: ConsultaDisponibilidadCitasDto) {
    return this.citaTallerService.consultarDisponibilidad(dto);
  }
}
