// src/notifications/notifications.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Crea una notificación (a un único userTarget).
   */
  async createNotification(options: {
    title: string;
    message?: string;
    type?: NotificationType;
    link?: string;
    meta?: Record<string, any>;
    userTargetId: string;
    userOriginId?: string;
  }): Promise<Notification> {
    console.log('[NotificationsService.createNotification] payload', options);
    const target = await this.userRepo.findOne({
      where: { id: options.userTargetId },
    });
    if (!target) throw new NotFoundException('Target user not found');

    let origin: User | undefined;
    if (options.userOriginId) {
      origin = await this.userRepo.findOne({
        where: { id: options.userOriginId },
      });
      // no bloqueamos si origin no existe; solo lo dejamos undefined
    }

    // crear instancia
    const n = this.notifRepo.create({
      title: options.title,
      message: options.message,
      type: options.type,
      link: options.link,
      meta: options.meta,
      userTarget: target,
      userOrigin: origin,
      read: false,
    } as Partial<Notification>);

    // Solo asignamos `active` si la entidad Notification tiene ese column definido.
    // Consultamos la metadata del repositorio para ser seguros en tiempo de ejecución.
    const hasActiveColumn =
      !!this.notifRepo.metadata.findColumnWithPropertyName('active');
    if (hasActiveColumn) {
      // usar any para evitar errores de tipado si Notification no define `active` en la interfaz
      (n as any).active = true;
    }

    const saved = await this.notifRepo.save(n);
    return saved;
    console.log(
      '[NotificationsService.createNotification] saved notification id=',
      saved.id,
    );
  }

  /**
   * Lista las notificaciones para un usuario (userTarget).
   * Si onlyUnread = true, devuelve sólo las no leídas.
   */
  async listForUser(userId: string, onlyUnread = false) {
    if (!userId) throw new BadRequestException('userId es requerido');

    const qb = this.notifRepo
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.userOrigin', 'userOrigin')
      .leftJoinAndSelect('n.userTarget', 'userTarget')
      .where('userTarget.id = :userId', { userId });

    if (onlyUnread) qb.andWhere('n.read = false');

    qb.orderBy('n.createdAt', 'DESC');

    const results = await qb.getMany();
    return results;
  }

  /**
   * Marca una notificación como leída/no leída.
   * destinationIdOrUserId: ID del usuario que marca (normalmente viene del token).
   * isReaded: boolean opcional (true por defecto).
   */
  async markAsRead(
    notificationId: string,
    destinationIdOrUserId: string,
    isReaded = true,
  ) {
    if (!notificationId)
      throw new BadRequestException('notificationId requerido');
    if (!destinationIdOrUserId)
      throw new BadRequestException('userId requerido');

    const n = await this.notifRepo.findOne({
      where: { id: notificationId },
      relations: ['userTarget', 'userOrigin'],
    });

    if (!n) throw new NotFoundException('Notification not found');

    // validar que el user que intenta marcar sea el destinatario de la notificación
    const targetId = (n.userTarget && (n.userTarget as any).id) || null;
    if (!targetId) {
      // si la notificación no tiene userTarget, no permitimos marcarla (política)
      throw new NotFoundException('Notification has no target user');
    }

    if (String(targetId) !== String(destinationIdOrUserId)) {
      // si no coincide, no permitimos la operación
      throw new ForbiddenException('No permission to mark this notification');
    }

    n.read = !!isReaded;
    const saved = await this.notifRepo.save(n);
    return saved;
  }

  /**
   * Marca todas las notificaciones del usuario como leídas (update masivo).
   */
  async markAllAsRead(userId: string) {
    if (!userId) throw new BadRequestException('userId requerido');

    // update masivo usando QueryBuilder
    await this.notifRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where('user_target_id = :userId', { userId })
      .andWhere('read = false')
      .execute();

    return { ok: true };
  }

  /**
   * Elimina / desactiva (soft-delete) una notificación.
   */
  async deleteNotification(id: string) {
    if (!id) throw new BadRequestException('id requerido');

    const n = await this.notifRepo.findOne({
      where: { id },
    });
    if (!n) throw new NotFoundException('Notification not found');

    // si tu entidad tiene campo `active` o similar, hacemos soft-delete
    const hasActiveColumn =
      !!this.notifRepo.metadata.findColumnWithPropertyName('active');
    if (hasActiveColumn) {
      (n as any).active = false;
      await this.notifRepo.save(n);
    } else {
      await this.notifRepo.remove(n);
    }
    return { ok: true };
  }

  /**
   * Setea active true/false (compatibilidad con PUT /notifications/active)
   */
  async setActive(id: string, active = false) {
    if (!id) throw new BadRequestException('id requerido');

    const n = await this.notifRepo.findOne({ where: { id } });
    if (!n) throw new NotFoundException('Notification not found');

    (n as any).active = !!active;
    await this.notifRepo.save(n);
    return { ok: true };
  }

  /**
   * Actualiza (merge) el campo `meta` de una notificación por id.
   * patch: por ejemplo { confirmed: true }
   */
  async updateNotificationMeta(
    notificationId: string,
    patch: Record<string, any>,
  ) {
    if (!notificationId)
      throw new BadRequestException('notificationId requerido');
    const n = await this.notifRepo.findOne({ where: { id: notificationId } });
    if (!n) throw new NotFoundException('Notification not found');

    const meta = typeof n.meta === 'string' ? JSON.parse(n.meta) : n.meta || {};
    const merged = { ...meta, ...patch };
    (n as any).meta = merged;
    const saved = await this.notifRepo.save(n);
    return saved;
  }

  /**
   * Marca como confirmadas (meta.confirmed = true) todas las notificaciones
   * que tengan meta.proposalId = proposalId.
   * Si se pasa userTargetId se filtra por destinatario (opcional).
   */
  async markNotificationsConfirmedByProposal(
    proposalId: string,
    userTargetId?: string,
  ) {
    if (!proposalId) throw new BadRequestException('proposalId requerido');

    // buscar notificaciones cuya meta->>'proposalId' = proposalId (Postgres JSONB)
    const qb = this.notifRepo
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.userTarget', 'userTarget')
      .where("n.meta->>'proposalId' = :pid", { pid: proposalId });

    if (userTargetId) {
      qb.andWhere('userTarget.id = :userTargetId', { userTargetId });
    }

    const list = await qb.getMany();
    if (!list.length) return { ok: true, updated: 0 };

    for (const n of list) {
      const meta =
        typeof n.meta === 'string' ? JSON.parse(n.meta) : n.meta || {};
      meta.confirmed = true;
      (n as any).meta = meta;
    }

    await this.notifRepo.save(list);
    return { ok: true, updated: list.length };
  }
}
