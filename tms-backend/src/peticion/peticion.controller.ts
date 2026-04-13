import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PeticionService } from './peticion.service';
import { CreatePeticionDto } from './dto/create-peticion.dto';
import { UpdatePeticionDto } from './dto/update-peticion.dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Peticion')
@Controller('petitions')
export class PeticionController {
  constructor(private readonly peticionService: PeticionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nueva petición' })
  async create(@Body() dto: CreatePeticionDto, @GetUser() user: User) {
    return this.peticionService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar peticiones (filtros opcionales)' })
  async list(
    @GetUser() user: User,
    @Query('tipoCarga') tipoCarga?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('clienteId') clienteId?: string,
  ) {
    const filters: any = {};
    if (tipoCarga) filters.tipoCarga = tipoCarga;
    if (status) filters.status = status;
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);
    if (clienteId) filters.clienteId = clienteId;

    return this.peticionService.listForUser(user, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una petición' })
  async getOne(@Param('id') id: string) {
    return this.peticionService.getOne(id);
  }

  @Get(':id/compatible-prestatarios')
  @ApiOperation({
    summary: 'Listar prestatarios compatibles para una petición',
  })
  async compatiblePrestatarios(@Param('id') id: string) {
    return this.peticionService.getCompatiblePrestatarios(id);
  }

  @Post(':id/assign')
  @ApiOperation({
    summary: 'Cliente acepta la assignment de una proposal para esta petición',
  })
  async acceptAssignment(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() body: { proposalId: string },
  ) {
    const { proposalId } = body;
    return this.peticionService.acceptAssignment(id, proposalId, user);
  }

  // ---------- PATCH /petitions/:id ----------
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar una petición (cliente propietario o admin)',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePeticionDto,
    @GetUser() user: User,
  ) {
    try {
      console.log('[controller] PATCH /petitions/%s body=%o', id, dto);
      return await this.peticionService.update(id, dto, user);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? (err.stack ?? err.message)
          : typeof err === 'object'
            ? JSON.stringify(err)
            : String(err);
      console.error('[controller] update ERROR:', msg);
      throw err;
    }
  }

  // ---------- PUT /petitions/:id (compat) ----------
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar una petición (compat PUT)',
  })
  async replace(
    @Param('id') id: string,
    @Body() dto: UpdatePeticionDto,
    @GetUser() user: User,
  ) {
    try {
      console.log('[controller] PUT /petitions/%s body=%o', id, dto);
      return await this.peticionService.update(id, dto, user);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? (err.stack ?? err.message)
          : typeof err === 'object'
            ? JSON.stringify(err)
            : String(err);
      console.error('[controller] replace ERROR:', msg);
      throw err;
    }
  }

  // ---------- DELETE /petitions/:id ----------
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar una petición (cliente propietario o admin)',
  })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    try {
      console.log('[controller] DELETE /petitions/%s', id);
      return await this.peticionService.remove(id, user);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? (err.stack ?? err.message)
          : typeof err === 'object'
            ? JSON.stringify(err)
            : String(err);
      console.error('[controller] remove ERROR:', msg);
      throw err;
    }
  }
}
