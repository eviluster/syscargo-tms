// src/notifications/entities/notification.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { User } from 'src/user/entities/user.entity';

export enum NotificationType {
  PROPOSAL = 'proposal',
  MESSAGE = 'message',
  SYSTEM = 'system',
  OTHER = 'other',
  PROPOSAL_ACCEPTED = 'proposal_accepted',
  PROPOSAL_REJECTED = 'proposal_rejected',
  PROPOSAL_CANCELLED = 'proposal_cancelled',
  PROPOSAL_CONFIRMED = 'proposal_confirmed',

  // nuevos tipos para cargas
  CARGA_STATUS = 'CARGA_STATUS',
  CARGA_REPROGRAMED = 'CARGA_REPROGRAMED',
  CARGA_CANCELLED = 'CARGA_CANCELLED',
  CARGA_DELIVERED = 'CARGA_DELIVERED',
}

@Entity('notifications')
export class Notification extends BasicEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type?: NotificationType;

  // Link útil para abrir en frontend (por ejemplo `/proposals/{id}`)
  @Column({ type: 'varchar', length: 500, nullable: true })
  link?: string;

  // JSON para metadatos (por ejemplo { cargaId, propostaId, importe })
  @Column({ type: 'jsonb', nullable: true })
  meta?: Record<string, any>;

  // quien disparó la notificación (puede ser el cliente o system)
  @ManyToOne(() => User, (u) => u.notifyOrigin, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_origin_id' })
  userOrigin?: User;

  // destinatario de la notificación (prestatario)
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_target_id' })
  userTarget: User;
}
