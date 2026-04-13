// src/solicitudes/solicitudes.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { Client } from 'src/cliente/entities/cliente.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

export enum SolicitudStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ASSIGNED = 'assigned',
}

@Entity({ name: 'solicitudes' })
export class Solicitud {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Datos solicitante
  @Column({ type: 'varchar', length: 200 })
  solicitante: string;

  @Column({ type: 'varchar', length: 50 })
  telefono: string;

  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  empresa?: string | null;

  // Especificaciones del espacio (pueden no aplicarse para todos los servicios)
  @Column({ type: 'float', nullable: true, default: 0 })
  metros_requeridos: number;

  @Column({ type: 'jsonb', nullable: true })
  tipo_uso?: string[] | null;

  @Column({ type: 'float', nullable: true })
  altura_m?: number | null;

  // Fechas y duración
  @Column({ type: 'date', nullable: true })
  fecha_inicio?: string;

  // nuevo: fecha_fin (alojamiento, etc)
  @Column({ type: 'date', nullable: true })
  fecha_fin?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  duracion?: string;

  // Acceso / horario
  @Column({ type: 'varchar', length: 50, nullable: true })
  acceso_horario?: string;

  // Condiciones ambientales
  @Column({ type: 'varchar', length: 80, nullable: true })
  control_temperatura?: string | null;

  // Servicios (lista de strings)
  @Column({ type: 'simple-array', nullable: true })
  servicios?: string[] | null;

  // Frecuencia de entrada/salida
  @Column({ type: 'varchar', length: 50, nullable: true })
  frecuencia?: string | null;

  // Clasificación de mercancía (si aplica)
  @Column({ type: 'varchar', length: 120, nullable: true })
  clasificacion_mercancia?: string | null;

  @Column({ type: 'text', nullable: true })
  comentarios?: string | null;

  /* ===================== nuevos campos por servicios ===================== */

  // alojamiento
  @Column({ type: 'int', nullable: true })
  habitaciones_requeridas?: number | null;

  @Column({ type: 'int', nullable: true })
  personas?: number | null;

  // gps
  @Column({ type: 'int', nullable: true })
  device_count?: number | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  plan?: string | null;

  // taller
  @Column({ type: 'varchar', length: 120, nullable: true })
  vehiculo_marca?: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  vehiculo_placa?: string | null;

  /* ===================== servicio & relaciones ===================== */

  // Nuevo: tipo de servicio asociado a esta solicitud (ej: 'alquiler','gps','taller','alojamiento', ...)
  @Index()
  @Column({
    name: 'service_requested',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  serviceRequested?: string | null;

  // Relaciones: cliente y assignedPrestatario
  @ManyToOne(() => Client, (client) => client.solicitudes, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'cliente_id' })
  cliente?: Client | null;

  @Column({ type: 'uuid', nullable: true })
  cliente_id?: string | null;

  @ManyToOne(() => Prestatario, (p) => p.solicitudes, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'assigned_prestatario_id' })
  assignedPrestatario?: Prestatario | null;

  @Column({ type: 'uuid', nullable: true })
  assigned_prestatario_id?: string | null;

  // Nuevo: prestatario que creó la solicitud (si fue creada por un prestatario)
  @ManyToOne(() => Prestatario, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'created_by_prestatario_id' })
  createdByPrestatario?: Prestatario | null;

  @Column({ name: 'created_by_prestatario_id', type: 'uuid', nullable: true })
  created_by_prestatario_id?: string | null;

  // Estado y auditoría
  @Column({ type: 'varchar', length: 30, default: SolicitudStatus.PENDING })
  status: SolicitudStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
