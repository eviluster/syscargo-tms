// src/cita-taller/entities/cita-taller.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { TallerServicio } from 'src/taller-servicio/entities/taller-servicio.entity';
import { AddressDetail } from 'src/address-details/entities/address-detail.entity';
import { Tipocarga } from 'src/tipocarga/entities/tipocarga.entity';
import { Tipotransporte } from 'src/tipotransporte/entities/tipotransporte.entity';

export enum EstadoCita {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
  EN_PROGRESO = 'en_progreso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Entity('cita_taller')
export class CitaTaller extends BasicEntity {
  @ManyToOne(() => Prestatario, (prestatario) => prestatario.citasComoTaller, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taller_id' })
  @Index()
  taller: Prestatario;

  @ManyToOne(() => Prestatario, (prestatario) => prestatario.citasComoCliente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cliente_id' })
  @Index()
  cliente: Prestatario;

  @ManyToOne(() => TallerServicio, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'servicio_id' })
  servicio: TallerServicio;

  @Column({ type: 'timestamptz' })
  fecha_hora_inicio: Date;

  @Column({ type: 'timestamptz' })
  fecha_hora_fin: Date;

  @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.PENDIENTE })
  estado: EstadoCita;

  // Datos Escatolina (opcionales)
  @Column({ type: 'boolean', default: false })
  es_servicio_escatolina: boolean;

  @ManyToOne(() => AddressDetail, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'origen_id' })
  origen: AddressDetail;

  @ManyToOne(() => AddressDetail, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'destino_id' })
  destino: AddressDetail;

  @ManyToOne(() => Tipocarga, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'tipo_carga_id' })
  tipo_carga: Tipocarga;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  peso_kg: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  volumen_m3: number;

  @ManyToOne(() => Tipotransporte, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'tipo_transporte_id' })
  tipo_transporte: Tipotransporte;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_estimada_viaje: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  licencia_operativa: string;

  // Precios calculados
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  precio_servicio_base: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  precio_flete_escatolina: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  precio_total: number;

  // Auditoría
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_solicitud: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_respuesta_taller: Date;

  @Column({ type: 'text', nullable: true })
  motivo_rechazo: string;

  @Column({ type: 'text', nullable: true })
  notas_adicionales: string;
}
