// src/prestatario/entities/prestatario.entity.ts
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { User } from 'src/user/entities/user.entity';
import { ViaMode } from 'src/carga/enum/vias';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';

export enum TipoCarga {
  SECO = 'Seco',
  REFRIGERADO = 'Refrigerado',
  CARGA_GENERAL = 'Carga general',
}
export enum Contenedor {
  C20 = '20',
  C40 = '40',
}

@Entity('prestatario')
export class Prestatario extends BasicEntity {
  @Column({ nullable: true })
  name: string;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  @Index({ unique: true })
  user: User;

  @Column({ type: 'enum', enum: TipoCarga, nullable: true })
  tipoCarga?: TipoCarga;

  @Column({ type: 'enum', enum: Contenedor, nullable: true })
  contenedor?: Contenedor;

  // transportes, ayudantes, etc como jsonb
  @Column({ type: 'jsonb', nullable: true })
  transportes?: Array<{
    nombreChofer?: string;
    chapa?: string;
    tipoTransporte?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  ayudantes?: Array<{ nombre?: string; apellidos?: string; ci?: string }>;

  @Column({ type: 'jsonb', nullable: true })
  cargasEspeciales?: string[];

  @Column({ type: 'float', nullable: true })
  rating?: number;

  @Column({ type: 'jsonb', nullable: true })
  licencia?: { numero: string; categoria: string; vence: string };

  /**
   * Capacity fields
   */
  @Column({ type: 'numeric', nullable: true })
  maxWeight?: number;

  @Column({ type: 'numeric', nullable: true })
  maxVolume?: number;

  @Column({ type: 'enum', enum: ViaMode, array: true, nullable: true })
  servicios?: ViaMode[];

  @Column({ type: 'text', nullable: true })
  conditions?: string;

  /**
   * Relación inversa: las solicitudes asignadas al prestatario
   */
  @OneToMany(() => Solicitud, (s) => s.assignedPrestatario, { nullable: true })
  solicitudes?: Solicitud[];

  /* ---------------------------
     Campos añadidos (camelCase)
     --------------------------- */

  // Alquiler
  @Column({ type: 'numeric', nullable: true })
  metrosDisponiblesAlquiler?: number | null;

  @Column({ type: 'numeric', nullable: true })
  alturaMAlquiler?: number | null;

  @Column({ type: 'jsonb', nullable: true })
  serviciosPrestAlquiler?: string[] | null;

  // Talleres
  @Column({ type: 'numeric', nullable: true })
  talleresNumTecnicos?: number | null;

  @Column({ type: 'text', nullable: true })
  talleresHorario?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  talleresServicios?: string[] | null;

  @Column({ type: 'numeric', nullable: true })
  talleresCapacidadVehiculos?: number | null;

  // GPS
  @Column({ type: 'jsonb', nullable: true })
  gpsProviders?: string[] | null;

  @Column({ type: 'numeric', nullable: true })
  gpsDevicesAvailable?: number | null;

  @Column({ type: 'text', nullable: true })
  gpsPlans?: string | null;

  @Column({ type: 'boolean', default: false })
  gpsIntegrationApi?: boolean;

  // Alojamiento
  @Column({ type: 'numeric', nullable: true })
  habitacionesDisponibles?: number | null;

  @Column({ type: 'numeric', nullable: true })
  capacidadPersonas?: number | null;

  @Column({ type: 'numeric', nullable: true })
  precioNochePromedio?: number | null;

  @Column({ type: 'jsonb', nullable: true })
  tipoHabitaciones?: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  serviciosIncluidosAlojamiento?: string[] | null;
}
