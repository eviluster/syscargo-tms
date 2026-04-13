// src/proposals_services/proposals-services.service.ts
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
import { ProposalService } from './entities/proposal-service.entity';
import { CreateProposalServiceDto } from './dto/create-proposal-service.dto';
import { UpdateProposalServiceStatusDto } from './dto/update-proposal-service-status.dto';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { User } from 'src/user/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entities/notification.entity';
import { SolicitudStatus } from 'src/solicitudes/solicitudes.entity';

@Injectable()
export class ProposalsServicesService {
  private readonly logger = new Logger(ProposalsServicesService.name);

  constructor(
    @InjectRepository(ProposalService)
    private readonly proposalRepo: Repository<ProposalService>,

    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,

    @InjectRepository(Prestatario)
    private readonly prestatarioRepo: Repository<Prestatario>,

    private readonly notificationsService: NotificationsService,

    private readonly dataSource: DataSource,
  ) {}

  async create(
    solicitudId: string | undefined,
    dto: CreateProposalServiceDto,
    proposer: User,
  ) {
    const prestatarioId = dto.prestatarioId || (dto as any).prestatario_id;
    const { message, serviceType } = dto as any;

    if (!prestatarioId && !solicitudId) {
      throw new BadRequestException('prestatarioId o solicitudId requeridos');
    }

    let solicitud: Solicitud | null = null;
    if (solicitudId) {
      solicitud = await this.solicitudRepo.findOne({
        where: { id: solicitudId },
        relations: ['cliente', 'cliente.user'],
      });
      if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

      // si la solicitud ya está asignada no permitir proponer
      if ((solicitud as any).assignedPrestatario) {
        throw new BadRequestException(
          'La solicitud ya está asignada y no puede proponerse',
        );
      }
    }

    const prestatario = await this.prestatarioRepo.findOne({
      where: { id: prestatarioId },
      relations: ['user'],
    });
    if (!prestatario) throw new NotFoundException('Prestatario no encontrado');

    // permiso básico: si existe solicitud y la solicitud.owner != proposer, solo admin o requester pueden proponer
    if (solicitud) {
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
    }

    // check duplicate pending (same prestatario + solicitud + serviceType)
    const qb = this.proposalRepo
      .createQueryBuilder('pr')
      .innerJoin('pr.prestatario', 'p')
      .where('p.id = :prestatarioId', { prestatarioId })
      .andWhere('pr.status = :status', { status: 'pending' });

    if (solicitudId) {
      qb.innerJoin('pr.solicitud', 's').andWhere('s.id = :solicitudId', {
        solicitudId,
      });
    } else {
      // direct proposal - check by serviceType maybe
      if (serviceType) {
        qb.andWhere('pr.serviceType = :serviceType', { serviceType });
      }
    }

    const existing = await qb.getOne();
    if (existing) {
      throw new ConflictException(
        'Ya existe una propuesta pendiente a este prestatario para este contexto',
      );
    }

    const instance = this.proposalRepo.create({
      solicitud: solicitud ?? null,
      prestatario,
      proposer,
      message,
      status: 'pending',
      serviceType:
        serviceType ??
        (solicitud ? (solicitud as any).serviceRequested : undefined),
    } as Partial<ProposalService>);

    const saved = await this.proposalRepo.save(instance);

    this.logger.log(
      `ProposalService creada id=${saved.id} solicitud=${solicitudId ?? 'direct'} prestatario=${prestatarioId}`,
    );

    // notificar al prestatario (si tiene user asociado)
    try {
      const targetUserId =
        prestatario.user?.id ?? (prestatario as any).userId ?? null;
      if (targetUserId) {
        await this.notificationsService.createNotification({
          title: `Nueva propuesta (${saved.serviceType ?? 'service'})`,
          message: `${proposer.name || proposer.username || 'Un usuario'} te propuso una solicitud.`,
          type: NotificationType.PROPOSAL,
          link: `/proposals_services/${saved.id}`,
          meta: {
            proposalId: saved.id,
            solicitudId: solicitudId ?? null,
            serviceType: saved.serviceType,
          },
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

  async listForUser(
    user: User,
    filters?: {
      solicitudId?: string;
      prestatarioId?: string;
      status?: string;
      serviceType?: string;
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
      // admin: no filter
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
    if (filters?.serviceType)
      qb.andWhere('pr.serviceType = :serviceType', {
        serviceType: filters.serviceType,
      });

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

    if (!item) throw new NotFoundException('ProposalService no encontrada');
    return item;
  }

  async updateStatus(
    id: string,
    dto: UpdateProposalServiceStatusDto,
    actor: User,
  ) {
    const { status, message } = dto;
    const proposal = await this.proposalRepo.findOne({
      where: { id },
      relations: ['solicitud', 'prestatario', 'prestatario.user', 'proposer'],
    });
    if (!proposal) throw new NotFoundException('ProposalService no encontrada');

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

      proposal.status = status;
      if (message) proposal.message = message;
      const saved = await this.proposalRepo.save(proposal);

      // notificar al proposer
      try {
        const proposerUserId = proposal.proposer?.id ?? null;
        if (proposerUserId) {
          const notifMessage =
            status === 'accepted'
              ? `${proposal.prestatario?.name || 'Un prestatario'} ha aceptado la propuesta.`
              : `${proposal.prestatario?.name || 'Un prestatario'} ha rechazado la propuesta.`;

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
            link: `/app/proposals_services/${saved.id}`,
            meta: {
              proposalId: saved.id,
              solicitudId: proposal.solicitud?.id ?? null,
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
            message: `La propuesta fue cancelada por el proposer.`,
            type: NotificationType.PROPOSAL_CANCELLED,
            link: `/app/proposals_services/${saved.id}`,
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

    // admin-only reopen to pending
    if (status === 'pending' && roleName !== 'administrador') {
      throw new ForbiddenException(
        'Solo administrador puede reabrir propuestas a pending',
      );
    }

    // fallback direct set
    proposal.status = status as any;
    if (message) proposal.message = message;
    return this.proposalRepo.save(proposal);
  }

  async confirmAssignment(proposalId: string, actor: User) {
    // transaction similar to ProposalAlquiler.confirmAssignment
    const result = await this.proposalRepo.manager.transaction(async (em) => {
      const prRepo = em.getRepository(ProposalService);
      const solRepo = em.getRepository(Solicitud);
      const prestatRepo = em.getRepository(Prestatario);

      const proposal = await prRepo.findOne({
        where: { id: proposalId },
        relations: ['solicitud', 'prestatario', 'prestatario.user', 'proposer'],
      });
      if (!proposal) throw new NotFoundException('Proposal no encontrada');

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

      // si no tiene solicitud asociada, no hay asignación de solicitud que hacer
      if (!proposal.solicitud || !proposal.solicitud.id) {
        throw new BadRequestException(
          'La proposal no está asociada a una solicitud',
        );
      }

      const solicitud = await solRepo.findOne({
        where: { id: proposal.solicitud.id },
      });
      if (!solicitud)
        throw new NotFoundException('Solicitud asociada no encontrada');

      if ((solicitud as any).assignedPrestatario) {
        throw new BadRequestException('La solicitud ya está asignada');
      }

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

      // si es serviceType 'alquiler' se valida capacidad (se reutiliza lógica original)
      if (proposal.serviceType === 'alquiler') {
        const requiredMeters = Number(
          (solicitud as any).metros_requeridos ?? 0,
        );

        const assignedRes: any = await em
          .createQueryBuilder(Solicitud, 's')
          .select('COALESCE(SUM(s.metros_requeridos),0)', 'sum')
          .where('s.assignedPrestatario = :pid', { pid: prestatario.id })
          .andWhere('s.status != :cancel', { cancel: 'cancelled' })
          .getRawOne();
        const assignedSum = Number(assignedRes?.sum ?? 0);

        const acceptedRes: any = await em
          .createQueryBuilder(ProposalService, 'pr')
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
      }

      (solicitud as any).assignedPrestatario = prestatario;
      solicitud.status = SolicitudStatus.ASSIGNED;
      await solRepo.save(solicitud);

      proposal.status = 'confirmed';
      await prRepo.save(proposal);

      return {
        proposal: proposal as ProposalService,
        solicitud: solicitud as Solicitud,
        prestatario,
      };
    });

    // fuera de tx: notificar
    try {
      const { proposal, solicitud, prestatario } = result;
      const prestatarioUserId = (prestatario as any)?.user?.id ?? null;
      if (prestatarioUserId) {
        await this.notificationsService.createNotification({
          title: 'Asignación confirmada',
          message: `Se confirmó la asignación de la solicitud ${solicitud.id ?? ''}.`,
          type: NotificationType.PROPOSAL_CONFIRMED,
          link: `/app/solicitudes/${solicitud.id}`,
          meta: { proposalId: proposal.id, solicitudId: solicitud.id },
          userTargetId: prestatarioUserId,
          userOriginId: result.proposal.proposer?.id ?? undefined,
        });
      }
    } catch (notifErr) {
      this.logger.warn(`Fallo al notificar confirmación: ${notifErr?.message}`);
    }

    // marcar notificaciones como confirmadas si existe helper
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
