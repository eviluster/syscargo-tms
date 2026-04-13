// src/carga/carga.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CargaService } from './carga.service';
import { CreateCargaDto } from './dto/create-carga.dto';
import { UpdateCargaDto } from './dto/update-carga.dto';
import { ReprogramDto } from './dto/reprogram.dto';
import { CancelDto } from './dto/cancel.dto';
import { ChangeStateDto } from './dto/change-state.dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/entities/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DeliverBase64Dto } from './dto/deliver-base64.dto';

@ApiTags('Carga')
@Controller('carga')
@ApiBearerAuth()
export class CargaController {
  constructor(private readonly cargaService: CargaService) {}

  // Listado global (puedes proteger solo admin si quieres RolesGuard)
  @Get('all')
  @UseGuards(JwtGuard)
  async findAll() {
    return this.cargaService.findAll();
  }

  @Get('all-public')
  async findAllPublic() {
    return this.cargaService.findAll();
  }

  // Obtener cargas por clientId (admin puede ver cualquiera; cliente solo sus cargas)
  @Get('client/:clientId')
  @UseGuards(JwtGuard)
  async findByClient(
    @GetUser() user: User,
    @Param('clientId') clientId: string,
  ) {
    return this.cargaService.findByClientId(clientId, user);
  }

  // Obtener cargas del cliente asociado al usuario autenticado
  @Get('me')
  @UseGuards(JwtGuard)
  async findMy(@GetUser() user: User) {
    return this.cargaService.findByUser(user);
  }

  // Obtener carga por id (owner o admin)
  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.cargaService.findOne(id, user);
  }

  // Crear carga:
  // - Cliente crea para sí (no necesita clientId)
  // - Admin puede pasar clientId en body para crear en nombre de otro cliente
  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() dto: CreateCargaDto & { clientId?: string },
  ) {
    return this.cargaService.create(dto, user);
  }

  // Editar carga (owner o admin)
  @Put(':id')
  @UseGuards(JwtGuard)
  async update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateCargaDto & { clientId?: string },
  ) {
    return this.cargaService.update(id, dto, user);
  }

  // Eliminar carga (owner o admin)
  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@GetUser() user: User, @Param('id') id: string) {
    await this.cargaService.remove(id, user);
  }

  // Reprogramar (fecha + motivo)
  @UseGuards(JwtGuard)
  @Post(':id/reprogram')
  async reprogram(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: ReprogramDto,
  ) {
    const actor = req.user;
    return this.cargaService.reprogram(id, dto, actor);
  }

  // Cancelar con motivo obligatorio
  @UseGuards(JwtGuard)
  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: CancelDto,
  ) {
    const actor = req.user;
    return this.cargaService.cancel(id, dto, actor);
  }

  // Entregar: subir fotos DNI frente/espalda y marcar firmado
  // Ajusta storage/dest y validaciones según tu config
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'dni_front', maxCount: 1 },
        { name: 'dni_back', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/pod',
          filename: (req, file, cb) => {
            const ext = file.originalname.split('.').pop();
            const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
            cb(null, name);
          },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  @Post(':id/deliver')
  @UseGuards(JwtGuard)
  async deliver(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFiles()
    files: {
      dni_front?: Express.Multer.File[];
      dni_back?: Express.Multer.File[];
    },
  ) {
    const actor = req.user;
    // signed flag puede venir en req.body.pod_signed = "true"/"false"
    const rawPod =
      req.body?.pod_signed ??
      req.body?.podSigned ??
      req.body?.signed ??
      req.body?.podSignedLegacy ??
      'false';
    const rawSig =
      req.body?.signatureConfirmed ??
      req.body?.signature_confirmed ??
      req.body?.signatureConfirmedLegacy ??
      req.body?.signature ??
      'false';

    const podSigned = String(rawPod) === 'true' || String(rawPod) === '1';
    const signatureConfirmed =
      String(rawSig) === 'true' || String(rawSig) === '1';
    return this.cargaService.markDelivered(id, {
      dniFront: files?.dni_front?.[0],
      dniBack: files?.dni_back?.[0],
      podSigned,
      signatureConfirmed,
      actor,
    });
  }

  /**
   * Avanzar / cambiar estado flexible:
   * - JSON: { status?: string, reason?:string, date?:string, note?:string }
   * - multipart/form-data: para entregas (status=entregado) con archivos dni_front / dni_back
   */
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'dni_front', maxCount: 1 },
        { name: 'dni_back', maxCount: 1 },
      ],
      {
        limits: { fileSize: 5 * 1024 * 1024 },
        // storage puede ser el mismo que usas en deliver()
        storage: diskStorage({
          destination: './uploads/pod',
          filename: (req, file, cb) => {
            const ext = file.originalname.split('.').pop();
            const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
            cb(null, name);
          },
        }),
      },
    ),
  )
  @Put(':id/advance')
  @Patch(':id/advance')
  @UseGuards(JwtGuard)
  async advanceState(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFiles()
    files: {
      dni_front?: Express.Multer.File[];
      dni_back?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    const actor = req.user;

    // Si multipart/form-data y status === 'entregado' -> markDelivered
    const contentType = (req.headers['content-type'] || '').toString();
    const isMultipart = contentType.includes('multipart/form-data');

    // Normalizar posibles nombres que venga del frontend
    const rawStatus = body?.status ?? body?.estado ?? null;
    let status: string | null = null;
    if (rawStatus != null) {
      status = String(rawStatus).split(',')[0].trim();
      if (status === '') status = null;
    }

    if (isMultipart && String(status) === 'entregado') {
      // El frontend puede mandar 'signed' o 'pod_signed' - aceptamos ambas
      const podSignedRaw = body?.signed ?? body?.pod_signed ?? body?.podSigned;
      const signatureConfirmedRaw =
        body?.signatureConfirmed ??
        body?.signature_confirmed ??
        body?.signatureConfirmed;

      const podSigned =
        String(podSignedRaw || 'false') === 'true' ||
        String(podSignedRaw || '0') === '1';
      const signatureConfirmed =
        String(signatureConfirmedRaw || 'false') === 'true' ||
        String(signatureConfirmedRaw || '0') === '1';

      return this.cargaService.markDelivered(id, {
        dniFront: files?.dni_front?.[0],
        dniBack: files?.dni_back?.[0],
        podSigned,
        signatureConfirmed,
        actor,
      });
    }

    // Si el body explícitamente pide reprogramar/cancelar -> delegar en esos métodos
    if (
      status === 'reprogramado' ||
      status === 'resprogramado' ||
      status === 'reprogramar'
    ) {
      // requiere date + reason
      const dto = {
        date: body?.date,
        reason: body?.reason || body?.motivo || body?.reason_text,
      };
      // validaciones básicas
      if (!dto.date || !dto.reason) {
        throw new BadRequestException('Reprogramación requiere date y reason');
      }
      return this.cargaService.reprogram(id, dto, actor);
    }

    if (status === 'cancelado' || status === 'cancel') {
      const dto = { reason: body?.reason || body?.motivo || body?.reason_text };
      if (!dto.reason) {
        throw new BadRequestException('Cancelación requiere reason');
      }
      return this.cargaService.cancel(id, dto, actor);
    }

    // Si nos pasan un "status" genérico distinto, intentamos que el service lo aplique
    if (status) {
      // body puede incluir note/reason/date, lo pasamos como payload
      return this.cargaService.advanceState(
        id,
        actor,
        body?.note ?? body?.note_text ?? null,
        {
          forceStatus: status,
          payload: body,
        } as any,
      );
    }

    // Si no hay status: avance por transición normal (nota opcional)
    return this.cargaService.advanceState(id, actor, body?.note ?? null);
  }

  // Entrega usando base64 (JSON)
  @Post(':id/deliver-base64')
  @UseGuards(JwtGuard)
  async deliverBase64(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: DeliverBase64Dto,
  ) {
    const actor = req.user;
    // normalizar booleans (por si vienen strings)
    const podSigned =
      dto.pod_signed === true || String((dto as any).pod_signed) === 'true';
    const signatureConfirmed =
      dto.signatureConfirmed === true ||
      String((dto as any).signatureConfirmed) === 'true' ||
      podSigned;

    return this.cargaService.markDeliveredBase64(id, {
      dniFrontBase64: dto.dni_front_base64,
      dniBackBase64: dto.dni_back_base64,
      podSigned,
      signatureConfirmed,
      actor,
    });
  }
}
