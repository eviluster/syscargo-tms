import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePrestatarioservDto, UpdatePrestatarioservDto } from './dto';
import { PrestatarioservService } from './prestatarioserv.service';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@ApiTags('prestatarioserv')
@Controller('api/prestatarioserv')
export class PrestatarioservController extends BaseControllerCRUD<
  CreatePrestatarioservDto,
  UpdatePrestatarioservDto,
  PrestatarioservService
> {
  constructor(private readonly Service: PrestatarioservService) {
    super(Service);
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los servicios' })
  override async findItems() {
    return super.findItems();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo servicio de prestatario' })
  override async create(@Body() createDto: CreatePrestatarioservDto) {
    return super.create(createDto);
  }

  @Get('prestatario/:prestatarioId')
  @ApiOperation({ summary: 'Obtener todos los servicios de un prestatario' })
  async findByPrestatario(
    @Param('prestatarioId', new ParseUUIDPipe()) prestatarioId: string,
  ) {
    return this.Service.findByPrestatario(prestatarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un servicio' })
  async updateById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdatePrestatarioservDto,
  ) {
    return this.Service.update({ ...updateDto, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un servicio' })
  async removeById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.Service.remove({ id } as DeleteDto);
  }

  @Put(':id/restore')
  @ApiOperation({ summary: 'Restaurar un servicio eliminado' })
  async restoreById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.Service.active({ id } as DeleteDto);
  }

  @Post('calculate-price')
  @ApiOperation({
    summary:
      'Calcular precio total de servicios (suma + 5% comisión plataforma)',
    description:
      'Input: array de IDs de PrestatarioServ. Output: subtotal + comisión + total',
  })
  async calculatePrice(
    @Body() body: { servicios_ids: string[] },
  ) {
    return this.Service.calculateTotalPrice(body.servicios_ids);
  }
}