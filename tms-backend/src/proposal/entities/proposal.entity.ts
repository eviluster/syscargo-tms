import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Carga } from 'src/carga/entities/carga.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { User } from 'src/user/entities/user.entity';
import { Peticion } from 'src/peticion/entities/peticion.entity';

export type ProposalStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'confirmed'
  | 'cancelled';

@Entity('proposal')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Carga, (c) => c.id, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  carga?: Carga;

  @ManyToOne(() => Peticion, (p) => p.id, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  peticion?: Peticion;

  @ManyToOne(() => Prestatario, (p) => p.id, { eager: true, nullable: false })
  prestatario: Prestatario;

  @ManyToOne(() => User, { eager: true, nullable: true })
  proposer?: User;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ProposalStatus;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'json', nullable: true })
  assignedVehicle?: Record<string, any>;

  @Column({ type: 'boolean', default: false, name: 'carta_generated' })
  carta_generated?: boolean;
}
