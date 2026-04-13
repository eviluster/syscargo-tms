import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from 'src/cliente/entities/cliente.entity';
import { Proposal } from 'src/proposal/entities/proposal.entity';

export type PeticionStatus = 'abierta' | 'asignada' | 'cancelada' | 'usada';

@Entity('peticion')
export class Peticion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nombreEntidad: string;

  @Column({ type: 'varchar', length: 200 })
  nombreCarga: string;

  @Column({ type: 'numeric', nullable: false })
  peso: number;

  @Column({ type: 'numeric', nullable: true })
  volumen?: number;

  @Column({ type: 'varchar', length: 200 })
  origen: string;

  @Column({ type: 'varchar', length: 200 })
  destino: string;

  @Column({ type: 'varchar', length: 100 })
  tipoCarga: string;

  @Column({ type: 'varchar', length: 20, default: 'abierta' })
  status: PeticionStatus;

  /**
   * Cliente dueño de la petición
   * FK: cliente_id -> client.id
   */
  @ManyToOne(() => Client, { eager: true, nullable: false })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Client;

  /**
   * Proposal confirmada/asignada a esta petición
   */
  @OneToOne(() => Proposal, { eager: true, nullable: true })
  @JoinColumn({ name: 'assigned_proposal_id' })
  assignedProposal?: Proposal;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
