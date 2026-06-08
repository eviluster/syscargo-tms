// src/proposals_services/entities/proposal-service.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('proposals_services')
export class ProposalService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // relación con solicitud (nullable: puede haber proposals directas sin solicitud)
  @ManyToOne(() => Solicitud, (s) => (s as any).proposalsServices, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'solicitud_id' })
  solicitud?: Solicitud | null;

  // prestatario objetivo (a quien se le propone)
  @ManyToOne(() => Prestatario, (p) => (p as any).proposalsServices, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'prestatario_id' })
  prestatario: Prestatario;

  // quien propone (user)
  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'proposer_id' })
  proposer: User;

  @Column({ type: 'varchar', length: 40, default: 'pending' })
  status: string; // pending | accepted | rejected | confirmed | cancelled

  @Column({ type: 'varchar', length: 50, nullable: true })
  serviceType?: string; // 'alquiler' | 'alojamiento' | 'gps' | 'talleres', etc.

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'boolean', default: false })
  carta_generated: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
