import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TallerHorarioService } from './taller-horario.service';
import { CreateTallerHorarioDto, UpdateTallerHorarioDto } from './dto/taller-horario.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('taller-horarios')
@Controller('taller-horarios')
export class TallerHorarioController {
  constructor(private readonly tallerHorarioService: TallerHorarioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo horario de taller' })
  @ApiResponse({ status: 201, description: 'Horario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Bad Request - Ya existe horario para ese día o prestatario no es taller' })
  @ApiResponse({ status: 404, description: 'Prestatario no encontrado' })
  create(@Body() createDto: CreateTallerHorarioDto) {
    return this.tallerHorarioService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios de taller' })
  @ApiQuery({ 
    name: 'prestatarioId',
    required: false,
    type: String,
    description: 'Filtrar por ID UUID del prestatario'
  })
  findAll(
    @Query('prestatarioId') prestatarioId?: string
  ) {
    return this.tallerHorarioService.findAll(prestatarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un horario por ID' })
  @ApiParam({ 
    name: 'id',
    type: String,
    description: 'ID UUID del horario'
  })
  findOne(
    @Param('id') id: string
  ) {
    return this.tallerHorarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un horario existente' })
  @ApiParam({ 
    name: 'id',
    type: String,
    description: 'ID UUID del horario'
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTallerHorarioDto
  ) {
    return this.tallerHorarioService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un horario' })
  @ApiParam({ 
    name: 'id',
    type: String,
    description: 'ID UUID del horario'
  })
  remove(
    @Param('id') id: string
  ) {
    return this.tallerHorarioService.remove(id);
  }

  @Get('prestatario/:prestatarioId')
  @ApiOperation({ summary: 'Obtener horarios de un prestatario específico' })
  @ApiParam({ 
    name: 'prestatarioId',
    type: String,
    description: 'ID UUID del prestatario'
  })
  findByPrestatario(
    @Param('prestatarioId') prestatarioId: string
  ) {
    return this.tallerHorarioService.findByPrestatario(prestatarioId);
  }
}