// src/proposals_alquiler/entities/proposal-alquiler.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('proposals_alquiler')
export class ProposalAlquiler {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Solicitud, (s) => (s as any).proposalsAlquiler, {
    onDelete: 'CASCADE',
  })
  solicitud: Solicitud;

  @ManyToOne(() => Prestatario, (p) => (p as any).proposalsAlquiler, {
    eager: true,
  })
  prestatario: Prestatario;

  @ManyToOne(() => User, { eager: true })
  proposer: User;

  @Column({ type: 'varchar', length: 40, default: 'pending' })
  status: string; // pending | accepted | rejected | confirmed | cancelled

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'boolean', default: false })
  carta_generated: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
