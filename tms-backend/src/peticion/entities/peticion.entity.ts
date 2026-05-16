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
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

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

  /** Modalidad: aerea, terrestre, maritima, etc. */
  @Column({ type: 'varchar', length: 32, nullable: true })
  via?: string | null;

  @Column({ type: 'text', nullable: true })
  origenDireccion?: string | null;

  @Column({ type: 'text', nullable: true })
  destinoDireccion?: string | null;

  /**
   * Transportista terrestre elegido por el cliente (prestatario).
   */
  @ManyToOne(() => Prestatario, { nullable: true, eager: false })
  @JoinColumn({ name: 'transportista_prestatario_id' })
  transportistaPrestatario?: Prestatario | null;

  /** Distancia estimada en km (opcional; si falta, el precio solo usa tramo por carga) */
  @Column({ type: 'numeric', nullable: true })
  distanciaKm?: number | null;

  /** Precio estimado (terrestre) guardado al crear la petición */
  @Column({ type: 'numeric', nullable: true })
  precioEstimado?: number | null;

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
