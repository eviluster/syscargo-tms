// src/carga/entities/carga.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { Origen } from 'src/origen/entities/origen.entity';
import { Destino } from 'src/destino/entities/destino.entity';
import { Doccarga } from 'src/doccarga/entities/doccarga.entity';
import { Prestatarioserv } from 'src/prestatarioserv/entities/prestatarioserv.entity';
import { TipoCargaEnum } from '../enum/tipo-carga.enum';
import { Client } from 'src/cliente/entities/cliente.entity';
import { Proposal } from 'src/proposal/entities/proposal.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { ViaMode } from 'src/carga/enum/vias';

export enum CargaStatus {
  DRAFT = 'borrador',
  PENDING_PROPOSALS = 'propuestas_pendientes',
  PROPOSED = 'propuesto',
  PROPOSAL_ACCEPTED = 'propuesta_aceptada',
  ASSIGNED = 'asignado',
  READY_FOR_PICKUP = 'listo_para_recoger',
  PICKED_UP = 'recogido',
  IN_TRANSIT = 'en_transito',
  ARRIVED_HUB = 'llegado_al_destino',
  OUT_FOR_DELIVERY = 'en_reparto_final',
  DELIVERED = 'entregado',
  RESCHEDULED = 'reprogramado',
  CANCELLED = 'cancelado',
}

@Entity('carga')
export class Carga extends BasicInformationEntity {
  @Column({ unique: true })
  order_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  fechaRegistro: Date;

  @Column({ unique: true, nullable: true })
  carga_serie: string;

  @Column()
  remitente_dni: string;

  @Column()
  remitente_nombre: string;

  @Column()
  direccion: string;

  @Column()
  emisor_dni: string;

  @Column()
  emisor_nombre: string;

  @Column({ nullable: true })
  emisor_direccion: string;

  @Column()
  cant_bultos: number;

  @Column()
  peso_total: number;

  @Column()
  vol_bulto: number;

  @ManyToOne(() => Origen, (origen) => origen.cargas, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'origen' })
  origen: Origen;

  @ManyToOne(() => Destino, (destino) => destino.cargas, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'destino' })
  destino: Destino;

  @Column()
  origen_string: string;

  @Column()
  destino_string: string;

  @Column()
  autorizado_recoger: string;

  @Column()
  tipo_carga: TipoCargaEnum;

  @OneToMany(() => Doccarga, (doccarga) => doccarga.carga)
  doccargas: Doccarga[];

  @ManyToOne(() => Client, (client) => client.cargas, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Client;

  @Column()
  precio: number;
  @Column()
  tarifabase: number;
  @Column()
  volumen: number;
  @Column()
  impuesto: number;
  @Column()
  comision: number;

  @OneToMany(() => Proposal, (proposal) => proposal.carga)
  proposals: Proposal[];

  /**
   * Prestatario asignado (nullable). Se crea columna assigned_prestatario_id.
   */
  @ManyToOne(() => Prestatario, { eager: true, nullable: true })
  @JoinColumn({ name: 'assigned_prestatario_id' })
  assignedPrestatario?: Prestatario;

  /**
   * Estado principal (ya lo tenías como 'estado'). Conservé el nombre 'estado'
   * y el enum CargaStatus.
   */
  @Column({
    type: 'enum',
    enum: CargaStatus,
    default: CargaStatus.PENDING_PROPOSALS,
  })
  estado: CargaStatus;

  /**
   * Vía de la carga (ya presente)
   */
  @Column({ type: 'enum', enum: ViaMode, nullable: true })
  via?: ViaMode;

  // ----------------------
  // Meta fields para POD / razones / fechas
  // ----------------------

  /**
   * Motivo / comentario cuando se cancela o reprograma u otros (nullable).
   */
  @Column({ type: 'text', nullable: true })
  status_reason?: string | null;

  /**
   * Fecha asociada al motivo (por ejemplo nueva fecha en reprogramado).
   */
  @Column({ type: 'timestamp', nullable: true })
  status_date?: Date | null;

  // Guardaremos base64 directamente en DB (texto largo)
  @Column({ type: 'text', nullable: true })
  pod_dni_front_base64?: string | null;

  @Column({ type: 'text', nullable: true })
  pod_dni_back_base64?: string | null;
  /**
   * Indica si el receptor firmó físicamente (POD signed)
   */
  @Column({ type: 'boolean', default: false })
  pod_signed?: boolean;

  @Column({ type: 'boolean', default: false })
  pod_signature_confirmed?: boolean;

  // ----------------------
  // Campos añadidos desde el formulario (colocados debajo de los existentes)
  // ----------------------

  // Fechas / identificadores
  @Column({ type: 'timestamptz', nullable: true })
  fecha_emision?: Date | null;

  @Column({ nullable: true })
  no_orden?: string;

  @Column({ nullable: true })
  comprador_interno?: string;

  // Autorizaciones / representante / firma
  @Column({ nullable: true })
  autorizado_lugar?: string;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_autorizada?: Date | null;

  @Column({ nullable: true })
  representante_nombre?: string;

  @Column({ nullable: true })
  representante_carnet?: string;

  @Column({ nullable: true })
  representante_cargo?: string;

  @Column({ nullable: true })
  firma?: string;

  // Producto / contenedor / bultos ya existen en la entidad base (agregamos tipo_producto y contenedor_siglas)
  @Column({ nullable: true })
  tipo_producto?: string;

  @Column({ nullable: true })
  contenedor_siglas?: string;

  // Destinatario específico
  @Column({ nullable: true })
  nombre_destinatario?: string;

  // Marítimos / documentos
  @Column({ nullable: true })
  nombre_buque?: string;

  @Column({ nullable: true })
  mfto_no?: string;

  @Column({ nullable: true })
  bl_no?: string;

  @Column({ nullable: true })
  dm_no?: string;

  // Vehículo / conductor / chapas / lot / hoja de ruta / carta porte etc.
  @Column({ nullable: true })
  vehiculo_pertenece_a?: string;

  @Column({ nullable: true })
  conducido_por?: string;

  @Column({ nullable: true })
  chapa_no?: string;

  @Column({ nullable: true })
  lot_no?: string;

  @Column({ nullable: true })
  hoja_ruta_no?: string;

  @Column({ nullable: true })
  carta_porte_no?: string;

  @Column({ nullable: true })
  chapa_tractivo_no?: string;

  @Column({ nullable: true })
  remolque_no?: string;

  @Column({ nullable: true })
  conductor_carnet_no?: string;

  @Column({ nullable: true })
  licencia_conduccion_no?: string;

  // Observaciones / basificado
  @Column({ nullable: true })
  basificado_en?: string;
}
