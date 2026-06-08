// src/proposals_alquiler/proposal-alquiler.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProposalAlquiler } from './entities/proposal-alquiler.entity';
import { CreateProposalAlquilerDto } from './dto/create-proposal-alquiler.dto';
import { UpdateProposalAlquilerStatusDto } from './dto/update-proposal-alquiler-status.dto';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { User } from 'src/user/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entities/notification.entity';
import { SolicitudStatus } from 'src/solicitudes/solicitudes.entity';

@Injectable()
export class ProposalsAlquilerService {
  private readonly logger = new Logger(ProposalsAlquilerService.name);

  constructor(
    @InjectRepository(ProposalAlquiler)
    private readonly proposalRepo: Repository<ProposalAlquiler>,

    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,

    @InjectRepository(Prestatario)
    private readonly prestatarioRepo: Repository<Prestatario>,

    private readonly notificationsService: NotificationsService,

    private readonly dataSource: DataSource,
  ) {}

  // create: propuesta de alquiler para una solicitud
  async create(
    solicitudId: string,
    dto: CreateProposalAlquilerDto,
    proposer: User,
  ) {
    const { prestatarioId, message } = dto as any;

    if (!solicitudId || !prestatarioId)
      throw new BadRequestException('solicitudId y prestatarioId requeridos');

    const solicitud = await this.solicitudRepo.findOne({
      where: { id: solicitudId },
      relations: ['cliente', 'cliente.user'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    // puedes validar estados de la solicitud si aplica (por ejemplo: no re-proponer si ya asignada)
    if ((solicitud as any).assignedPrestatario) {
      throw new BadRequestException(
        'La solicitud ya está asignada y no puede proponerse',
      );
    }

    const prestatario = await this.prestatarioRepo.findOne({
      where: { id: prestatarioId },
      relations: ['user'],
    });
    if (!prestatario) throw new NotFoundException('Prestatario no encontrado');

    const isAdmin = proposer?.role?.name?.toLowerCase?.() === 'administrador';
    const solicitudOwnerUserId = solicitud.cliente?.user?.id ?? null;
    if (
      !isAdmin &&
      solicitudOwnerUserId &&
      solicitudOwnerUserId !== proposer.id
    ) {
      throw new ForbiddenException(
        'No tienes permiso para proponer esta solicitud',
      );
    }

    // check duplicado pending
    // corregido
    const existing = await this.proposalRepo
      .createQueryBuilder('pr')
      .innerJoin('pr.solicitud', 's')
      .innerJoin('pr.prestatario', 'p')
      .where('s.id = :solicitudId', { solicitudId })
      .andWhere('p.id = :prestatarioId', { prestatarioId })
      .andWhere('pr.status = :status', { status: 'pending' })
      .getOne();

    if (existing) {
      throw new ConflictException(
        'Ya existe una propuesta pendiente a este prestatario para esta solicitud',
      );
    }

    const instance = this.proposalRepo.create({
      solicitud,
      prestatario,
      proposer,
      message,
      status: 'pending',
    });
    const saved = await this.proposalRepo.save(instance);

    this.logger.log(
      `ProposalAlquiler creada id=${saved.id} solicitud=${solicitudId} prestatario=${prestatarioId}`,
    );

    // crear notificación al prestatario (si tiene user asociado)
    try {
      const targetUserId =
        prestatario.user?.id ?? (prestatario as any).userId ?? null;
      if (targetUserId) {
        await this.notificationsService.createNotification({
          title: 'Nueva propuesta de alquiler',
          message: `${proposer.name || proposer.username || 'Un cliente'} te propuso una solicitud.`,
          type: NotificationType.PROPOSAL,
          link: `/proposals_alquiler/${saved.id}`,
          meta: { proposalId: saved.id, solicitudId, action: 'new_proposal' },
          userTargetId: targetUserId,
          userOriginId: proposer.id,
        });
      } else {
        this.logger.warn(
          `Prestatario ${prestatarioId} no tiene user.id -> no se notificó.`,
        );
      }
    } catch (e) {
      this.logger.warn(`Fallo al crear notificación: ${e?.message}`, e);
    }

    return saved;
  }

  // list for user (mismo patrón que proposal.listForUser)
  async listForUser(
    user: User,
    filters?: {
      solicitudId?: string;
      prestatarioId?: string;
      status?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const qb = this.proposalRepo
      .createQueryBuilder('pr')
      .leftJoinAndSelect('pr.solicitud', 's')
      .leftJoinAndSelect('pr.prestatario', 'p')
      .leftJoinAndSelect('pr.proposer', 'proposer');

    const roleName = user?.role?.name?.toLowerCase?.();

    if (roleName === 'prestatario') {
      qb.innerJoin('p.user', 'p_user').andWhere('p_user.id = :userId', {
        userId: user.id,
      });
    } else if (roleName === 'cliente' || roleName === 'client') {
      qb.leftJoin('s.cliente', 'cliente')
        .leftJoin('cliente.user', 'cliente_user')
        .andWhere('cliente_user.id = :userId', { userId: user.id });
    } else if (roleName === 'administrador' || roleName === 'admin') {
      // admin: no filtro
    } else {
      qb.andWhere('proposer.id = :userId', { userId: user.id });
    }

    if (filters?.solicitudId)
      qb.andWhere('s.id = :solicitudId', { solicitudId: filters.solicitudId });
    if (filters?.prestatarioId)
      qb.andWhere('p.id = :prestatarioId', {
        prestatarioId: filters.prestatarioId,
      });
    if (filters?.status)
      qb.andWhere('pr.status = :status', { status: filters.status });

    qb.orderBy('pr.createdAt', 'DESC');

    if (filters?.limit) qb.limit(filters.limit);
    if (filters?.offset) qb.offset(filters.offset);

    return qb.getMany();
  }

  async getOne(id: string) {
    const item = await this.proposalRepo.findOne({
      where: { id },
      relations: ['solicitud', 'prestatario', 'prestatario.user', 'proposer'],
    });

    if (!item) throw new NotFoundException('ProposalAlquiler no encontrada');
    return item;
  }

  // update status: accept/reject/cancel/pending etc.
  async updateStatus(
    id: string,
    dto: UpdateProposalAlquilerStatusDto,
    actor: User,
  ) {
    const { status, message } = dto;
    const proposal = await this.proposalRepo.findOne({
      where: { id },
      relations: ['solicitud', 'prestatario', 'prestatario.user', 'proposer'],
    });
    if (!proposal)
      throw new NotFoundException('ProposalAlquiler no encontrada');

    const roleName = actor?.role?.name?.toLowerCase?.();

    // accept/reject by prestatario or admin
    if (status === 'accepted' || status === 'rejected') {
      const prestatarioUserId = proposal.prestatario?.user?.id;
      if (!prestatarioUserId)
        throw new BadRequestException(
          'El prestatario no tiene usuario asociado',
        );
      if (roleName !== 'administrador' && prestatarioUserId !== actor.id) {
        throw new ForbiddenException(
          'No autorizado para aceptar/rechazar esta propuesta',
        );
      }
      if (proposal.status !== 'pending') {
        throw new BadRequestException(
          'Solo propuestas en estado "pending" pueden aceptarse o rechazarse',
        );
      }

      // (opcional) validaciones de capacidad si tu prestatario maneja capacidad para solicitudes de alquiler
      // ... copia la lógica de sumas si tienes campos equivalentes en Solicitud

      proposal.status = status;
      if (message) proposal.message = message;
      const saved = await this.proposalRepo.save(proposal);

      // notificar al proposer (cliente)
      try {
        const proposerUserId = proposal.proposer?.id ?? null;
        if (proposerUserId) {
          const notifMessage =
            status === 'accepted'
              ? `${proposal.prestatario?.name || 'Un prestatario'} ha aceptado la propuesta para la solicitud ${proposal.solicitud?.id}. Confirma para asignar.`
              : `${proposal.prestatario?.name || 'Un prestatario'} ha rechazado la propuesta para la solicitud ${proposal.solicitud?.id}.`;

          await this.notificationsService.createNotification({
            title:
              status === 'accepted'
                ? 'Propuesta aceptada'
                : 'Propuesta rechazada',
            message: notifMessage,
            type:
              status === 'accepted'
                ? NotificationType.PROPOSAL_ACCEPTED
                : NotificationType.PROPOSAL_REJECTED,
            link: `/app/proposals_alquiler/${saved.id}`,
            meta: {
              proposalId: saved.id,
              solicitudId: proposal.solicitud.id,
              action: status === 'accepted' ? 'confirm_assignment' : 'info',
            },
            userTargetId: proposerUserId,
            userOriginId: actor.id,
          });
        }
      } catch (notifErr) {
        this.logger.warn(`Fallo al notificar proposer: ${notifErr?.message}`);
      }

      return saved;
    }

    // cancel by proposer
    if (status === 'cancelled') {
      const proposerId = proposal.proposer?.id ?? null;
      if (roleName !== 'administrador' && proposerId !== actor.id) {
        throw new ForbiddenException('Solo quien propuso puede cancelar');
      }
      if (proposal.status !== 'pending') {
        throw new BadRequestException(
          'Solo propuestas en estado "pending" pueden cancelarse',
        );
      }
      proposal.status = 'cancelled';
      if (message) proposal.message = message;
      const saved = await this.proposalRepo.save(proposal);

      // notificar prestatario
      try {
        const prestatarioUserId = proposal.prestatario?.user?.id;
        if (prestatarioUserId) {
          await this.notificationsService.createNotification({
            title: 'Propuesta cancelada',
            message: `La propuesta fue cancelada por el cliente.`,
            type: NotificationType.PROPOSAL_CANCELLED,
            link: `/app/proposals_alquiler/${saved.id}`,
            meta: { proposalId: saved.id },
            userTargetId: prestatarioUserId,
            userOriginId: actor.id,
          });
        }
      } catch (e) {
        this.logger.warn(`Fallo al notificar cancelación: ${e?.message}`);
      }

      return saved;
    }

    // fallback admin re-open or other transitions
    if (status === 'pending' && roleName !== 'administrador') {
      throw new ForbiddenException(
        'Solo administrador puede reabrir propuestas a pending',
      );
    }

    // fallback set status directly
    proposal.status = status as any;
    if (message) proposal.message = message;
    return this.proposalRepo.save(proposal);
  }

  /**
   * Confirmar asignación (cliente confirma la propuesta aceptada).
   * Realiza:
   *  - valida permisos (solo proposer o admin)
   *  - valida que proposal.status === 'accepted'
   *  - bloquea prestatario (pessimistic_write)
   *  - valida capacidad (si prestatario.max_metros / metros_disponibles_alquiler está definido)
   *  - setea solicitud.assignedPrestatario = prestatario y solicitud.status = 'assigned' (ajusta valor si usas otro)
   *  - setea proposal.status = 'confirmed'
   *  - notifica al prestatario
   */
  async confirmAssignment(proposalId: string, actor: User) {
    const result = await this.proposalRepo.manager.transaction(async (em) => {
      const prRepo = em.getRepository(ProposalAlquiler);
      const solRepo = em.getRepository(Solicitud);
      const prestatRepo = em.getRepository(Prestatario);

      // cargar proposal con relaciones útiles
      const proposal = await prRepo.findOne({
        where: { id: proposalId },
        relations: ['solicitud', 'prestatario', 'prestatario.user', 'proposer'],
      });
      if (!proposal)
        throw new NotFoundException('Proposal alquiler no encontrada');

      // permiso: solo proposer (cliente) o admin
      const proposerUserId =
        proposal.proposer?.id ?? (proposal.proposer as any)?.user?.id;
      const roleName = actor?.role?.name?.toLowerCase?.();
      if (roleName !== 'administrador' && proposerUserId !== actor.id) {
        throw new ForbiddenException(
          'No autorizado para confirmar esta asignación',
        );
      }

      if (proposal.status !== 'accepted') {
        throw new BadRequestException(
          'Solo proposals en estado "accepted" pueden confirmarse',
        );
      }

      // solicitud asociada
      const solicitud = await solRepo.findOne({
        where: { id: proposal.solicitud.id },
      });
      if (!solicitud)
        throw new NotFoundException('Solicitud asociada no encontrada');

      // no permitir confirmar si ya está asignada
      if (
        (solicitud as any).assignedPrestatario &&
        (solicitud as any).assignedPrestatario !== null
      ) {
        throw new BadRequestException('La solicitud ya está asignada');
      }

      // cargar prestatario y hacer lock
      const prestatario = await prestatRepo.findOne({
        where: { id: proposal.prestatario.id },
      });
      if (!prestatario)
        throw new NotFoundException('Prestatario no encontrado');

      // lock pesimista
      await em
        .createQueryBuilder(Prestatario, 'p')
        .setLock('pessimistic_write')
        .where('p.id = :id', { id: prestatario.id })
        .getOne();

      // VALIDACIÓN DE CAPACIDAD (si aplica) usando metros
      try {
        const requiredMeters = Number(solicitud.metros_requeridos ?? 0);

        // suma metros ya asignados al prestatario (solicitudes asignadas)
        const assignedRes: any = await em
          .createQueryBuilder(Solicitud, 's')
          .select('COALESCE(SUM(s.metros_requeridos),0)', 'sum')
          .where('s.assignedPrestatario = :pid', { pid: prestatario.id })
          .andWhere('s.status != :cancel', { cancel: 'cancelled' })
          .getRawOne();
        const assignedSum = Number(assignedRes?.sum ?? 0);

        // sumar propuestas accepted reservadas (excluyendo esta proposal)
        const acceptedRes: any = await em
          .createQueryBuilder(ProposalAlquiler, 'pr')
          .innerJoin('pr.solicitud', 's')
          .innerJoin('pr.prestatario', 'p')
          .where('p.id = :prestatarioId', { prestatarioId: prestatario.id })
          .andWhere('pr.status = :statusAccepted', {
            statusAccepted: 'accepted',
          })
          .andWhere('pr.id != :prId', { prId: proposalId })
          .select('COALESCE(SUM(s.metros_requeridos),0)', 'sum')
          .getRawOne();
        const acceptedSum = Number(acceptedRes?.sum ?? 0);

        // obtener capacidad máxima si existe (puede llamarse diferente en tu entidad)
        const maxMeters = Number(
          (prestatario as any).max_metros ??
            (prestatario as any).metros_disponibles_alquiler ??
            NaN,
        );

        if (!Number.isNaN(maxMeters)) {
          if (assignedSum + acceptedSum + requiredMeters > maxMeters) {
            throw new BadRequestException(
              `No se puede confirmar: capacidad excedida. Prestatario: ${maxMeters}. Asignado+reservado: ${assignedSum + acceptedSum}. Esta solicitud: ${requiredMeters}`,
            );
          }
        }
      } catch (e) {
        // si falla validación de capacidad, re-lanzar
        throw e;
      }

      // Realizar asignación sobre la solicitud
      (solicitud as any).assignedPrestatario = prestatario;
      // Ajusta este valor al enum/strings que use tu app
      // Por ejemplo: 'assigned' o 'asignado' o SolicitudStatus.ASSIGNED
      solicitud.status = SolicitudStatus.ASSIGNED;

      await solRepo.save(solicitud);

      // marcar proposal como confirmed
      proposal.status = 'confirmed';
      await prRepo.save(proposal);

      // retornar datos para notificar fuera de la tx
      return {
        proposal: proposal as ProposalAlquiler,
        solicitud: solicitud as Solicitud,
        prestatario,
      };
    });

    // fuera de la transacción: notificar al prestatario
    try {
      const { proposal, solicitud, prestatario } = result;
      const prestatarioUserId = (prestatario as any)?.user?.id ?? null;
      if (prestatarioUserId) {
        await this.notificationsService.createNotification({
          title: 'Asignación confirmada',
          message: `El cliente confirmó la asignación de la solicitud ${solicitud.id ?? ''}. Procede con la gestión.`,
          type:
            (this.notificationsService as any).NotificationType ?? undefined,
          link: `/app/solicitudes/${solicitud.id}`,
          meta: { proposalId: proposal.id, solicitudId: solicitud.id },
          userTargetId: prestatarioUserId,
          userOriginId: result.proposal.proposer?.id ?? undefined,
        });
      }
    } catch (notifErr) {
      this.logger.warn(`Fallo al notificar confirmación: ${notifErr?.message}`);
    }

    // marcar notificaciones relacionadas como confirmadas si tu NotificationsService lo soporta
    try {
      const { proposal } = result;
      if (
        (this.notificationsService as any).markNotificationsConfirmedByProposal
      ) {
        const proposerUserId =
          proposal.proposer?.id ?? (proposal.proposer as any)?.user?.id;
        await (
          this.notificationsService as any
        ).markNotificationsConfirmedByProposal(proposal.id, proposerUserId);
      }
    } catch (e) {
      this.logger.warn(
        `Fallo al marcar notificaciones como confirmadas: ${e?.message}`,
      );
    }

    return { ok: true, proposal: result.proposal, solicitud: result.solicitud };
  }

  // marcar carta generated
  async markCartaGenerated(proposalId: string, actor: User) {
    const proposal = await this.proposalRepo.findOne({
      where: { id: proposalId },
      relations: ['prestatario', 'prestatario.user', 'proposer'],
    });
    if (!proposal) throw new NotFoundException('Proposal no encontrada');

    const roleName = actor?.role?.name?.toLowerCase?.();
    if (roleName === 'administrador' || roleName === 'admin') {
      proposal.carta_generated = true;
      return this.proposalRepo.save(proposal);
    }

    const prestatarioUserId = proposal.prestatario?.user?.id ?? null;
    if (!prestatarioUserId)
      throw new BadRequestException(
        'La proposal no tiene prestatario con usuario',
      );
    if (String(prestatarioUserId) !== String(actor.id)) {
      throw new ForbiddenException(
        'No autorizado para marcar esta carta como generada',
      );
    }

    proposal.carta_generated = true;
    return this.proposalRepo.save(proposal);
  }
}
