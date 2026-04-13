// src/carga/carga.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carga, CargaStatus } from './entities/carga.entity';
import { CreateCargaDto } from './dto/create-carga.dto';
import { UpdateCargaDto } from './dto/update-carga.dto';
import { Client } from 'src/cliente/entities/cliente.entity';
import { User } from 'src/user/entities/user.entity';
import { ViaMode } from './enum/vias';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ReprogramDto } from './dto/reprogram.dto';
import { CancelDto } from './dto/cancel.dto';
import { NotificationType } from 'src/notifications/entities/notification.entity';

@Injectable()
export class CargaService {
  private readonly logger = new Logger(CargaService.name);
  constructor(
    @InjectRepository(Carga)
    private readonly cargaRepository: Repository<Carga>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  private async ensureAssignedPrestatarioOrAdmin(carga: Carga, actor: User) {
    const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
    if (isAdmin) return;
    const assignedUserId = carga.assignedPrestatario?.user?.id ?? null;
    if (!assignedUserId)
      throw new ForbiddenException(
        'Carga no está asignada a ningún prestatario',
      );
    if (String(assignedUserId) !== String(actor.id))
      throw new ForbiddenException(
        'No autorizado para operar sobre esta carga',
      );
  }

  async findAll(): Promise<Carga[]> {
    return this.cargaRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, actor?: User): Promise<Carga> {
    const carga = await this.cargaRepository.findOne({
      where: { id },
      relations: ['cliente', 'cliente.user'],
    });
    if (!carga) throw new NotFoundException(`Carga ${id} no encontrada`);

    if (actor) {
      const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
      const isOwner = carga.cliente?.user && carga.cliente.user.id === actor.id;
      if (!isAdmin && !isOwner) {
        throw new ForbiddenException('No tienes permiso para ver esta carga');
      }
    }
    return carga;
  }

  async findByClientId(clientId: string, actor?: User): Promise<Carga[]> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
      relations: ['user'],
    });
    if (!client) throw new NotFoundException('Client no encontrado');

    if (actor) {
      const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
      const isOwner = client.user?.id === actor.id;
      if (!isAdmin && !isOwner) {
        throw new ForbiddenException(
          'No autorizado para ver cargas de este cliente',
        );
      }
    }

    return this.cargaRepository.find({
      where: { cliente: { id: clientId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(user: User): Promise<Carga[]> {
    const client = await this.clientRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!client) {
      throw new NotFoundException(
        'No se encontró perfil de cliente para este usuario',
      );
    }

    return this.cargaRepository.find({
      where: { cliente: { id: client.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    dto: CreateCargaDto & { clientId?: string },
    actor: User,
  ): Promise<Carga> {
    const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';

    let client: Client | null = null;

    if (isAdmin) {
      // admin: requiere clientId (si no lo pasa lo rechazamos por seguridad)
      if (!dto.clientId) {
        throw new BadRequestException(
          'clientId es requerido cuando un administrador crea la carga',
        );
      }
      client = await this.clientRepository.findOne({
        where: { id: dto.clientId },
      });
      if (!client) throw new NotFoundException('Client no encontrado');
    } else {
      // actor no admin -> buscar cliente asociado al user
      client = await this.clientRepository.findOne({
        where: { user: { id: actor.id } },
      });
      if (!client) {
        throw new NotFoundException(
          'No se encontró perfil de cliente para este usuario',
        );
      }
    }

    const carga = new Carga();

    // Mapeo directo desde DTO (ya validado). Ajusta si necesitas transformar tipos o relacionar Origen/Destino por id.
    carga.order_id = dto.order_id;
    carga.carga_serie = dto.carga_serie;

    // Remitente / Emisor
    carga.remitente_dni = dto.remitente_dni;
    carga.remitente_nombre = dto.remitente_nombre;
    carga.direccion = dto.direccion;

    carga.emisor_dni = dto.emisor_dni;
    carga.emisor_nombre = dto.emisor_nombre;

    // Si tu entidad espera Date en lugar de string, convierte aquí:
    carga.fecha_emision = dto.fecha_emision
      ? new Date(dto.fecha_emision)
      : undefined;
    //    carga.fecha_emision = dto.fecha_emision;

    // emisor_direccion es opcional según tu DTO (lo dejamos)
    carga.emisor_direccion = dto.emisor_direccion;

    // Cantidades / medidas
    carga.cant_bultos = dto.cant_bultos;
    carga.peso_total = dto.peso_total;
    carga.vol_bulto = dto.vol_bulto;

    // Datos de autorización / representante / firma
    carga.autorizado_lugar = dto.autorizado_lugar;
    carga.fecha_autorizada = dto.fecha_autorizada
      ? new Date(dto.fecha_autorizada)
      : undefined;
    //carga.fecha_autorizada = dto.fecha_autorizada;
    carga.representante_nombre = dto.representante_nombre;
    carga.representante_carnet = dto.representante_carnet;
    carga.representante_cargo = dto.representante_cargo;
    carga.firma = dto.firma;

    // Origen / Destino (strings)
    carga.origen_string = dto.origen_string;
    carga.destino_string = dto.destino_string;

    // Autorizado a recoger / tipo de carga / comprador interno / no_orden
    carga.autorizado_recoger = dto.autorizado_recoger;
    carga.tipo_carga = dto.tipo_carga; // si tipo_carga es enum en Carga, debería mapearse ok
    carga.comprador_interno = dto.comprador_interno;
    carga.no_orden = dto.no_orden;

    // Producto / contenedor / destinatario
    carga.tipo_producto = dto.tipo_producto;
    carga.contenedor_siglas = dto.contenedor_siglas;
    carga.nombre_destinatario = dto.nombre_destinatario;

    // Campos marítimos/terrestres/vehículo (opcionales)
    carga.nombre_buque = dto.nombre_buque;
    carga.mfto_no = dto.mfto_no;
    carga.bl_no = dto.bl_no;
    carga.dm_no = dto.dm_no;

    carga.vehiculo_pertenece_a = dto.vehiculo_pertenece_a;
    carga.conducido_por = dto.conducido_por;
    carga.chapa_no = dto.chapa_no;
    carga.lot_no = dto.lot_no;
    carga.hoja_ruta_no = dto.hoja_ruta_no;
    carga.carta_porte_no = dto.carta_porte_no;
    carga.chapa_tractivo_no = dto.chapa_tractivo_no;
    carga.remolque_no = dto.remolque_no;
    carga.conductor_carnet_no = dto.conductor_carnet_no;
    carga.licencia_conduccion_no = dto.licencia_conduccion_no;

    carga.basificado_en = dto.basificado_en;

    // Cálculos / precios
    carga.precio = dto.precio;
    carga.tarifabase = dto.tarifabase;
    carga.volumen = dto.volumen;
    carga.impuesto = dto.impuesto;
    carga.comision = dto.comision;

    // Vía (enum ViaMode en DTO). Mapea directamente o normaliza si en la entidad lo guardas diferente.
    carga.via = dto.via as any;

    // Asignación de cliente/responsable
    carga.cliente = client;

    // Guardar
    return this.cargaRepository.save(carga);
  }

  async update(
    id: string,
    dto: UpdateCargaDto & { clientId?: string },
    actor: User,
  ): Promise<Carga> {
    const carga = await this.cargaRepository.findOne({
      where: { id },
      relations: ['cliente', 'cliente.user'],
    });
    if (!carga) throw new NotFoundException('Carga no encontrada');

    const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
    const isOwner = carga.cliente?.user?.id === actor.id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta carga',
      );
    }

    // Actualizar solo campos presentes en dto
    const fields: (keyof UpdateCargaDto)[] = [
      'remitente_dni',
      'remitente_nombre',
      'direccion',
      'emisor_dni',
      'emisor_nombre',
      'emisor_direccion',
      'cant_bultos',
      'peso_total',
      'vol_bulto',
      'autorizado_recoger',
      'tipo_carga',
      'order_id',
      'carga_serie',
      'origen_string',
      'destino_string',
      'precio',
      'tarifabase',
      'volumen',
      'impuesto',
      'comision',
      'via' as any,
    ];

    for (const f of fields) {
      if (
        Object.prototype.hasOwnProperty.call(dto, f) &&
        (dto as any)[f] !== undefined
      ) {
        (carga as any)[f] = (dto as any)[f];
      }
    }

    if ((dto as any).via !== undefined) {
      carga.via = (dto as any).via as ViaMode;
    }

    // Reasignar client solo si es admin y se pasó clientId
    if (dto.clientId && isAdmin) {
      const newClient = await this.clientRepository.findOne({
        where: { id: dto.clientId },
      });
      if (!newClient)
        throw new NotFoundException('Client para reasignar no encontrado');
      carga.cliente = newClient;
    }

    return this.cargaRepository.save(carga);
  }

  async remove(id: string, actor: User): Promise<void> {
    const carga = await this.cargaRepository.findOne({
      where: { id },
      relations: ['cliente', 'cliente.user'],
    });
    if (!carga) throw new NotFoundException('Carga no encontrada');

    const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
    const isOwner = carga.cliente?.user?.id === actor.id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta carga',
      );
    }

    await this.cargaRepository.remove(carga);
  }

  // Reprogramar: requiere date + reason
  async reprogram(id: string, dto: ReprogramDto, actor: User) {
    return this.dataSource.transaction(async (em) => {
      const repo = em.getRepository(Carga);
      const c = await repo.findOne({
        where: { id },
        relations: [
          'assignedPrestatario',
          'assignedPrestatario.user',
          'cliente',
          'cliente.user',
        ],
      });
      if (!c) throw new NotFoundException('Carga no encontrada');

      await this.ensureAssignedPrestatarioOrAdmin(c, actor);

      c.estado = CargaStatus.RESCHEDULED;
      c.status_reason = dto.reason;
      c.status_date = new Date(dto.date);
      await repo.save(c);

      const clientUserId = c.cliente?.user?.id;
      if (clientUserId) {
        await this.notificationsService.createNotification({
          title: 'Carga reprogramada',
          message: `La carga ${c.order_id ?? c.id} fue reprogramada para ${c.status_date?.toISOString?.()} - Motivo: ${dto.reason}`,
          type: NotificationType.CARGA_REPROGRAMED,
          link: `/app/cargas/${c.id}`,
          meta: {
            cargaId: c.id,
            estado: c.estado,
            reason: dto.reason,
            date: c.status_date,
          },
          userTargetId: clientUserId,
          userOriginId: actor.id,
        });
      }

      return c;
    });
  }

  // Cancelar con motivo obligatorio
  async cancel(id: string, dto: CancelDto, actor: User) {
    return this.dataSource.transaction(async (em) => {
      const repo = em.getRepository(Carga);
      const c = await repo.findOne({
        where: { id },
        relations: [
          'assignedPrestatario',
          'assignedPrestatario.user',
          'cliente',
          'cliente.user',
        ],
      });
      if (!c) throw new NotFoundException('Carga no encontrada');

      await this.ensureAssignedPrestatarioOrAdmin(c, actor);

      c.estado = CargaStatus.CANCELLED;
      c.status_reason = dto.reason;
      await repo.save(c);

      const clientUserId = c.cliente?.user?.id;
      if (clientUserId) {
        await this.notificationsService.createNotification({
          title: 'Carga cancelada',
          message: `La carga ${c.order_id ?? c.id} fue cancelada. Motivo: ${dto.reason}`,
          type: NotificationType.CARGA_CANCELLED,
          link: `/app/cargas/${c.id}`,
          meta: { cargaId: c.id, estado: c.estado, reason: dto.reason },
          userTargetId: clientUserId,
          userOriginId: actor.id,
        });
      }

      return c;
    });
  }

  // Mark delivered: recibe archivos (Multer file objects), podSigned boolean, signatureConfirmed; guarda URLs y marca DELIVERED
  async markDelivered(
    id: string,
    payload: {
      dniFront?: Express.Multer.File;
      dniBack?: Express.Multer.File;
      podSigned?: boolean;
      signatureConfirmed?: boolean;
      actor: User;
    },
  ) {
    return this.dataSource.transaction(async (em) => {
      const repo = em.getRepository(Carga);
      const c = await repo.findOne({
        where: { id },
        relations: [
          'assignedPrestatario',
          'assignedPrestatario.user',
          'cliente',
          'cliente.user',
        ],
      });
      if (!c) throw new NotFoundException('Carga no encontrada');

      await this.ensureAssignedPrestatarioOrAdmin(c, payload.actor);

      // validar que existan los archivos y confirmación
      if (
        !payload.dniFront ||
        !payload.dniBack ||
        !payload.podSigned ||
        !payload.signatureConfirmed
      ) {
        throw new BadRequestException(
          'Para marcar entregado necesitas: dni_front, dni_back, pod_signed=true y signatureConfirmed=true',
        );
      }

      c.pod_signed = Boolean(payload.podSigned);

      c.estado = CargaStatus.DELIVERED;
      await repo.save(c);

      const clientUserId = c.cliente?.user?.id;
      if (clientUserId) {
        await this.notificationsService.createNotification({
          title: 'Carga entregada',
          message: `La carga ${c.order_id ?? c.id} ha sido entregada. Revisa comprobantes.`,
          type: NotificationType.CARGA_DELIVERED,
          link: `/app/cargas/${c.id}`,
          meta: { cargaId: c.id, estado: c.estado },
          userTargetId: clientUserId,
          userOriginId: payload.actor.id,
        });
      }

      return c;
    });
  }

  /**
   * markDeliveredBase64
   * - Guarda las imágenes base64 en DB (campos pod_dni_front_base64, pod_dni_back_base64)
   * - Valida tamaño y mime
   * - Marca la carga como entregada y notifica al cliente
   */
  async markDeliveredBase64(
    id: string,
    payload: {
      dniFrontBase64?: string;
      dniBackBase64?: string;
      podSigned?: boolean;
      signatureConfirmed?: boolean;
      actor: User;
    },
  ) {
    return this.dataSource.transaction(async (em) => {
      const repo = em.getRepository(Carga);
      const c = await repo.findOne({
        where: { id },
        relations: [
          'assignedPrestatario',
          'assignedPrestatario.user',
          'cliente',
          'cliente.user',
        ],
      });
      if (!c) throw new NotFoundException('Carga no encontrada');

      // permisos
      await this.ensureAssignedPrestatarioOrAdmin(c, payload.actor);

      // validar payload mínimo
      if (
        !payload.dniFrontBase64 ||
        !payload.dniBackBase64 ||
        !payload.podSigned ||
        !payload.signatureConfirmed
      ) {
        throw new BadRequestException(
          'Para marcar entregado necesitas: dni_front_base64, dni_back_base64, pod_signed=true y signatureConfirmed=true',
        );
      }

      // Validar formato base64 (simple)
      const re = /^data:(image\/\w+);base64,([A-Za-z0-9+/=]+)$/;
      const mFront = String(payload.dniFrontBase64).match(re);
      const mBack = String(payload.dniBackBase64).match(re);
      if (!mFront || !mBack) {
        throw new BadRequestException(
          'Base64 inválido. Asegúrate de usar data:image/...;base64,...',
        );
      }

      // límite de bytes (después de decodificar)
      const MAX_BYTES = 1_500_000; // 1.5MB (ajusta según tus necesidades)
      const bufFront = Buffer.from(mFront[2], 'base64');
      const bufBack = Buffer.from(mBack[2], 'base64');
      if (bufFront.length > MAX_BYTES || bufBack.length > MAX_BYTES) {
        throw new BadRequestException('Imagen demasiado grande (máx ~1.5MB).');
      }

      // Guardar base64 directamente en DB
      c.pod_dni_front_base64 = payload.dniFrontBase64;
      c.pod_dni_back_base64 = payload.dniBackBase64;

      c.pod_signed = Boolean(payload.podSigned);
      c.pod_signature_confirmed = Boolean(payload.signatureConfirmed);

      c.estado = CargaStatus.DELIVERED;
      await repo.save(c);

      // notificar al cliente
      const clientUserId = c.cliente?.user?.id;
      if (!clientUserId) {
        this.logger.debug(
          `[markDelivered] No client user id para carga ${c.id}`,
        );
      } else {
        try {
          this.logger.debug(
            `[markDelivered] Notificando entrega carga ${c.id} a ${clientUserId}`,
          );
          await this.notificationsService.createNotification({
            title: 'Carga entregada',
            message: `La carga ${c.order_id ?? c.id} ha sido entregada. Revisa comprobantes.`,
            type: NotificationType.CARGA_DELIVERED,
            link: `/app/cargas/${c.id}`,
            meta: { cargaId: c.id, estado: c.estado },
            userTargetId: clientUserId,
            userOriginId: payload.actor.id,
          });
        } catch (err) {
          this.logger.warn(
            `[markDelivered] Error creando notificación para carga ${c.id}: ${err?.message ?? err}`,
            err,
          );
        }
      }

      return c;
    });
  }
  /**
   * advanceState
   * - id: carga id
   * - actor: usuario que realiza la acción
   * - note: nota simple (opcional) que se acumula en status_reason
   * - options?: { forceStatus?: string, payload?: any }
   *
   * Si forceStatus viene, aplicamos la transición/acción correspondiente:
   *  - 'reprogramado' => reprogram flow (requires payload.date + payload.reason)
   *  - 'cancelado' => cancel flow (requires payload.reason)
   *  - 'entregado' => si viene payload.files -> markDelivered (no cubierto aquí)
   *  - si forceStatus coincide con siguiente en mapa => aplicarlo
   *
   * Si no viene forceStatus => avanzamos según nextMap (lo que ya tenías).
   */
  async advanceState(
    id: string,
    actor: User,
    note?: string | null,
    options?: { forceStatus?: string; payload?: any },
  ) {
    return this.dataSource.transaction(async (em) => {
      const repo = em.getRepository(Carga);
      const c = await repo.findOne({
        where: { id },
        relations: [
          'assignedPrestatario',
          'assignedPrestatario.user',
          'cliente',
          'cliente.user',
        ],
      });
      if (!c) throw new NotFoundException('Carga no encontrada');

      await this.ensureAssignedPrestatarioOrAdmin(c, actor);

      // mapa de transiciones (mantener consistente con enum)
      const nextMap: Record<CargaStatus, CargaStatus | null> = {
        [CargaStatus.ASSIGNED]: CargaStatus.READY_FOR_PICKUP,
        [CargaStatus.READY_FOR_PICKUP]: CargaStatus.PICKED_UP,
        [CargaStatus.PICKED_UP]: CargaStatus.IN_TRANSIT,
        [CargaStatus.IN_TRANSIT]: CargaStatus.ARRIVED_HUB,
        [CargaStatus.ARRIVED_HUB]: CargaStatus.OUT_FOR_DELIVERY,
        [CargaStatus.OUT_FOR_DELIVERY]: CargaStatus.DELIVERED,
        [CargaStatus.DELIVERED]: null,
        [CargaStatus.PENDING_PROPOSALS]: null,
        [CargaStatus.PROPOSAL_ACCEPTED]: null,
        [CargaStatus.PROPOSED]: null,
        [CargaStatus.DRAFT]: null,
        [CargaStatus.RESCHEDULED]: CargaStatus.READY_FOR_PICKUP,
        [CargaStatus.CANCELLED]: null,
      };

      const forceRaw = options?.forceStatus
        ? String(options.forceStatus)
        : null;
      const force = forceRaw ? forceRaw.split(',')[0].trim() : null;

      if (force) {
        // normalizar a valores del enum si vienen en string
        // comprobar acciones especiales
        if (force === CargaStatus.RESCHEDULED || force === 'reprogramado') {
          // require date + reason en payload
          const payload = options?.payload ?? {};
          const date = payload?.date ?? payload?.status_date;
          const reason = payload?.reason ?? payload?.motivo;
          if (!date || !reason) {
            throw new BadRequestException(
              'Reprogramación requiere date y reason',
            );
          }
          c.estado = CargaStatus.RESCHEDULED;
          c.status_reason = reason;
          c.status_date = new Date(date);
          await repo.save(c);

          // notificar
          const clientUserId = c.cliente?.user?.id;
          if (!clientUserId) {
            this.logger.debug(
              `[reprogram] No client user id para carga ${c.id}`,
            );
          } else {
            try {
              this.logger.debug(
                `[reprogram] Notificando reprogramación carga ${c.id} a ${clientUserId}`,
              );
              await this.notificationsService.createNotification({
                title: 'Carga reprogramada',
                message: `La carga ${c.order_id ?? c.id} fue reprogramada para ${c.status_date?.toISOString?.()} - Motivo: ${reason}`,
                type: NotificationType.CARGA_REPROGRAMED,
                link: `/app/cargas/${c.id}`,
                meta: {
                  cargaId: c.id,
                  estado: c.estado,
                  reason: reason,
                  date: c.status_date,
                },
                userTargetId: clientUserId,
                userOriginId: actor.id,
              });
            } catch (err) {
              this.logger.warn(
                `[reprogram] Error creando notificación para carga ${c.id}: ${err?.message ?? err}`,
                err,
              );
            }
          }

          return c;
        }

        if (force === CargaStatus.CANCELLED || force === 'cancelado') {
          const reason = options?.payload?.reason ?? options?.payload?.motivo;
          if (!reason) {
            throw new BadRequestException('Cancelación requiere motivo');
          }
          c.estado = CargaStatus.CANCELLED;
          c.status_reason = reason;
          await repo.save(c);

          const clientUserId = c.cliente?.user?.id;
          if (!clientUserId) {
            this.logger.debug(`[cancel] No client user id para carga ${c.id}`);
          } else {
            try {
              this.logger.debug(
                `[cancel] Notificando cancelación carga ${c.id} a ${clientUserId}`,
              );
              await this.notificationsService.createNotification({
                title: 'Carga cancelada',
                message: `La carga ${c.order_id ?? c.id} fue cancelada. Motivo: ${reason}`,
                type: NotificationType.CARGA_CANCELLED,
                link: `/app/cargas/${c.id}`,
                meta: { cargaId: c.id, estado: c.estado, reason: reason },
                userTargetId: clientUserId,
                userOriginId: actor.id,
              });
            } catch (err) {
              this.logger.warn(
                `[cancel] Error creando notificación para carga ${c.id}: ${err?.message ?? err}`,
                err,
              );
            }
          }

          return c;
        }

        // Si el force coincide con el siguiente en el mapa, aplicarlo
        const expectedNext = nextMap[c.estado];
        if (expectedNext && String(expectedNext) === String(force)) {
          c.estado = expectedNext;
          if (note)
            c.status_reason =
              (c.status_reason ? c.status_reason + '\n' : '') + note;
          await repo.save(c);

          // notificar al cliente (con logging y manejo de errores para no romper flujo)
          const clientUserId = c.cliente?.user?.id;
          if (!clientUserId) {
            this.logger.debug(
              `[advanceState] No client user id para carga ${c.id} (estado: ${c.estado})`,
            );
          } else {
            try {
              this.logger.debug(
                `[advanceState] Creando notificación para carga ${c.id} -> user ${clientUserId}, estado ${c.estado}`,
              );
              await this.notificationsService.createNotification({
                title: 'Cambio de estado de tu carga',
                message: `La carga ${c.order_id ?? c.id} cambió a estado: ${c.estado}.`,
                type: NotificationType.CARGA_STATUS,
                link: `/app/cargas/${c.id}`,
                meta: { cargaId: c.id, estado: c.estado },
                userTargetId: clientUserId,
                userOriginId: actor.id,
              });
            } catch (err) {
              this.logger.warn(
                `[advanceState] Error creando notificación para carga ${c.id} -> user ${clientUserId}: ${err?.message ?? err}`,
                err,
              );
              // no throw; la acción principal ya se completó (estado cambiado)
            }
          }

          return c;
        }

        // Si llega un force que no es aplicable -> error
        throw new BadRequestException(
          `No se puede forzar el estado a "${force}" desde "${c.estado}"`,
        );
      }

      // Si no hay forceStatus: avanzar al siguiente estado definido
      const next = nextMap[c.estado];
      if (!next) {
        throw new BadRequestException(
          'No existe siguiente estado definido desde ' + c.estado,
        );
      }

      c.estado = next;
      if (note)
        c.status_reason =
          (c.status_reason ? c.status_reason + '\n' : '') + note;
      await repo.save(c);

      // notificar al cliente
      const clientUserId = c.cliente?.user?.id;
      if (clientUserId) {
        await this.notificationsService.createNotification({
          title: 'Cambio de estado de tu carga',
          message: `La carga ${c.order_id ?? c.id} cambió a estado: ${c.estado}.`,
          type: NotificationType.CARGA_STATUS,
          link: `/app/cargas/${c.id}`,
          meta: { cargaId: c.id, estado: c.estado },
          userTargetId: clientUserId,
          userOriginId: actor.id,
        });
      }

      return c;
    });
  }
}
