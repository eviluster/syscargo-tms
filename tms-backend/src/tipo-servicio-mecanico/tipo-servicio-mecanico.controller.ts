import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TipoServicioMecanicoService } from './tipo-servicio-mecanico.service';
import { CreateTipoServicioMecanicoDto, UpdateTipoServicioMecanicoDto } from './dto/tipo-servicio-mecanico.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('tipos-servicio-mecanico')
@Controller('tipos-servicio-mecanico')
export class TipoServicioMecanicoController {
  constructor(
    private readonly tipoServicioService: TipoServicioMecanicoService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo tipo de servicio mecánico (catálogo)'
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de servicio creado exitosamente'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Código ya existe'
  })
  create(
    @Body() createDto: CreateTipoServicioMecanicoDto
  ) {
    return this.tipoServicioService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de servicio mecánico activos'
  })
  findAll() {
    return this.tipoServicioService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de servicio por ID UUID'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID UUID del tipo de servicio'
  })
  findOne(
    @Param('id') id: string
  ) {
    return this.tipoServicioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de servicio existente'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID UUID del tipo de servicio'
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTipoServicioMecanicoDto
  ) {
    return this.tipoServicioService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un tipo de servicio'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID UUID del tipo de servicio'
  })
  remove(
    @Param('id') id: string
  ) {
    return this.tipoServicioService.remove(id);
  }
}