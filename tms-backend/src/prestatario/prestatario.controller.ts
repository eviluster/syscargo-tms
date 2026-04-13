// src/prestatario/prestatario.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
  Get,
  Put,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { PrestatarioService } from './prestatario.service';
import { CreatePrestatarioDto } from './dto/create-prestatario.dto';
import { Request as ExpressRequest } from 'express';
import { TipoCarga } from './entities/prestatario.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateProposalDto } from 'src/proposal/dto/create-proposal.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { ParseIntPipe } from '@nestjs/common';
import { ViaMode } from 'src/carga/enum/vias';

// Allowed service keys
const ALLOWED_SERVICE_KEYS = ['alojamiento', 'gps', 'talleres'] as const;
type ServiceKey = (typeof ALLOWED_SERVICE_KEYS)[number];

// helper (puedes moverlo a util.ts si quieres)
function normalizeServiciosRaw(raw: any): string[] | null {
  if (raw == null) return null;
  // si ya es array -> plain strings
  if (Array.isArray(raw))
    return raw.map((v) => String(v).trim()).filter(Boolean);

  // si es string -> intentar JSON.parse (ej: '["aerea","maritima"]')
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed))
        return parsed.map((v) => String(v).trim()).filter(Boolean);
    } catch (e) {
      // no es JSON: intentar CSV "aerea,maritima"
      return raw
        .split?.(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }

  // si viene un Proxy/reactive u otro objeto -> stringify/parse como último recurso
  try {
    const str = JSON.stringify(raw);
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed))
      return parsed.map((v) => String(v).trim()).filter(Boolean);
  } catch (e) {
    // fallback: convertir a string único
  }

  return [String(raw)];
}

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Prestatarios')
@Controller('prestatario')
export class PrestatarioController {
  constructor(private readonly prestatarioService: PrestatarioService) {}

  @Get('all')
  async getAll() {
    return this.prestatarioService.findAll();
  }

  @Get('service/:key')
  @ApiOperation({
    summary:
      'Listar prestatarios que ofrecen un servicio (alojamiento|gps|talleres)',
  })
  async findByService(
    @Param('key') key: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    const keyStr = String(key || '').toLowerCase();
    if (!ALLOWED_SERVICE_KEYS.includes(keyStr as ServiceKey)) {
      throw new BadRequestException(
        `Service inválido. Valores permitidos: ${ALLOWED_SERVICE_KEYS.join(', ')}`,
      );
    }
    const lim = Number(limit ?? 20);
    const pg = Math.max(1, Number(page ?? 1));
    return this.prestatarioService.findByService(keyStr as ServiceKey, lim, pg);
  }

  // añade esto en PrestatarioController, antes de @Get(':id')
  @Get('match-space')
  @ApiOperation({
    summary:
      'Buscar prestatarios por metros y altura disponibles (match-space)',
  })
  async matchSpace(
    @Query('metros') metrosStr?: string,
    @Query('altura') alturaStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    // parseo y validación básica
    const metros = metrosStr !== undefined ? Number(metrosStr) : undefined;
    const altura = alturaStr !== undefined ? Number(alturaStr) : undefined;
    const limit = limitStr ? Number(limitStr) : 50;

    if (
      (metrosStr !== undefined && Number.isNaN(metros)) ||
      (alturaStr !== undefined && Number.isNaN(altura))
    ) {
      throw new BadRequestException(
        'Parámetros inválidos: metros y altura deben ser numéricos',
      );
    }

    return this.prestatarioService.findMatchingBySpace(metros, altura, limit);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear prestatario (vinculado al user actual o admin)',
  })
  async create(
    @Body() body: any,
    dto: CreatePrestatarioDto,
    @Req() req: ExpressRequest,
  ) {
    console.log('RAW BODY (stringified):', JSON.stringify(Body));
    const user = (req as any).user as any;
    return this.prestatarioService.create(dto, user);
  }

  @Get('search')
  async search(
    @Query('tipoCarga') tipoCarga: TipoCarga,
    @Query('weight') weight?: string,
    @Query('volume') volume?: string,
    @Query('via') via?: string,
    @Query('limit') limit?: string,
  ) {
    const w = weight ? Number(weight) : undefined;
    const v = volume ? Number(volume) : undefined;
    const lim = limit ? Number(limit) : 50;

    if (!tipoCarga) {
      throw new BadRequestException('tipoCarga es requerido');
    }

    // validar via (opcional)
    let viaEnum: ViaMode | undefined = undefined;
    if (via) {
      const viaNorm = String(via).toLowerCase();

      const allowed = Object.values(ViaMode).map((x) =>
        String(x).toLowerCase(),
      );
      if (!allowed.includes(viaNorm)) {
        throw new BadRequestException(
          `Parámetro 'via' inválido. Valores permitidos: ${Object.values(
            ViaMode,
          ).join(', ')}`,
        );
      }

      // recuperar el valor original del enum (case-sensitive tal cual está definido)
      viaEnum = Object.values(ViaMode).find(
        (x) => String(x).toLowerCase() === viaNorm,
      ) as ViaMode;
    }

    // Nota: la firma de findMatchingByCapacity debe aceptar (tipoCarga, weight?, volume?, via?, limit?)
    return this.prestatarioService.findMatchingByCapacity(
      tipoCarga,
      w,
      v,
      viaEnum,
      lim,
    );
  }

  @Get('match-alojamiento')
  async matchAlojamiento(
    @Query('habitaciones') habitacionesStr?: string,
    @Query('personas') personasStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const habitaciones = habitacionesStr ? Number(habitacionesStr) : undefined;
    const personas = personasStr ? Number(personasStr) : undefined;
    const limit = limitStr ? Number(limitStr) : 50;
    return this.prestatarioService.findMatchingByAlojamiento(
      habitaciones,
      personas,
      undefined,
      undefined,
      limit,
    );
  }

  @Get('match-taller')
  async matchTaller(
    @Query('tipo_trabajo') tipoTrabajo?: string | string[],
    @Query('limit') limitStr?: string,
  ) {
    const limit = limitStr ? Number(limitStr) : 50;
    // tipo_trabajo puede venir: 'Mantenimiento' | 'Mantenimiento,Diagnóstico' | ['Mantenimiento','Diagnóstico']
    return this.prestatarioService.findMatchingByTaller(tipoTrabajo, limit);
  }

  @Get('match-gps')
  async matchGps(
    @Query('device_count') deviceCountStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const deviceCount = deviceCountStr ? Number(deviceCountStr) : undefined;
    const limit = limitStr ? Number(limitStr) : 50;
    return this.prestatarioService.findMatchingByGps(deviceCount, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener prestatario por id' })
  async findOneById(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ) {
    return this.prestatarioService.findOneById(id);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Obtener prestatario por userId' })
  async findByUser(@Param('userId') userId: string) {
    return this.prestatarioService.findOneByUserId(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar prestatario' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePrestatarioDto>,
  ) {
    return this.prestatarioService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar prestatario' })
  async remove(@Param('id') id: string) {
    await this.prestatarioService.remove(id);
  }
}
