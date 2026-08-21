// src/prestatario/entities/prestatario.entity.ts
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { User } from 'src/user/entities/user.entity';
import { ViaMode } from 'src/carga/enum/vias';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';
import { TallerServicio } from 'src/taller-servicio/entities/taller-servicio.entity';
import { TallerHorario } from 'src/taller-horario/entities/taller-horario.entity';
import { CitaTaller } from 'src/cita-taller/entities/cita-taller.entity';
import { AddressDetail } from 'src/address-details/entities/address-detail.entity';

export enum TipoCarga {
  SECO = 'Seco',
  REFRIGERADO = 'Refrigerado',
  CARGA_GENERAL = 'Carga general',
}
export enum Contenedor {
  C20 = '20',
  C40 = '40',
  ISOTANQUE_20 = 'Isotanque de 20"',
  ISOTANQUE_40 = 'Isotanque de 40"',
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
  ayudantes?: Array<{ nombre?: string; apellidos?: string; ci?: string; direccion?: string }>;

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

  @Column({ name: 'default_aereo', type: 'boolean', default: false })
  defaultAereo?: boolean;

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

  @Column({ type: 'text', nullable: true })
  talleresDireccion?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  talleresPrecios?: Record<string, number> | null;

  @Column({ type: 'boolean', default: false })
  talleresReservaCitas?: boolean;

  @Column({ type: 'text', nullable: true })
  talleresHorarioInicio?: string | null;

  @Column({ type: 'text', nullable: true })
  talleresHorarioFin?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  talleresDiasDisponibles?: string[] | null;

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

  /**
   * Precios personalizados para servicio terrestre
   * precioTerrestrePorKm: precio por kilómetro recorrido
   * precioTerrestrePorCarga: precios por tipo de carga (ej: contenedor, carga general)
   */
  @Column({ type: 'jsonb', nullable: true })
  precioTerrestre?: {
    precioPorKm?: number;
    precioPorCarga?: Record<string, number>;
  } | null;

  /**
   * Campos adicionales para el perfil del prestatario (cálculos de oferta)
   */

  // Cantidad de camiones y consumo de gasolina
  @Column({ type: 'numeric', nullable: true })
  cantidadCamiones?: number | null;

  @Column({ type: 'numeric', nullable: true })
  consumoGasolina?: number | null; // Consumo promedio por km o por viaje

  // Tipos de vehículos disponibles
  @Column({ type: 'jsonb', nullable: true })
  tiposVehiculos?: string[] | null; // ['contenerizados', 'carga general', 'freezer', 'cubicaje', 'triciclos', 'abiertos', 'cerrados']

  // Capacidad de carga por tipo de vehículo
  @Column({ type: 'jsonb', nullable: true })
  capacidadPorTipo?: Record<string, { maxWeight?: number; maxVolume?: number }> | null;

  // Disponibilidad (estado y fechas)
  @Column({ type: 'boolean', default: true })
  disponible?: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  disponibilidadDesde?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  disponibilidadHasta?: Date | null;

  // Zona de cobertura geográfica
  @Column({ type: 'jsonb', nullable: true })
  zonaCobertura?: {
    provincias?: string[];
    municipios?: string[];
    regiones?: string[];
    radioKm?: number;
    coordenadas?: { lat: number; lng: number };
  } | null;

  /**
   * Campos para funcionalidad de Taller
   */
  @Column({ type: 'boolean', default: false })
  es_taller: boolean;

  @Column({ type: 'boolean', default: false })
  tiene_escatolina: boolean;

  @ManyToOne(() => AddressDetail, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'taller_direccion_id' })
  taller_direccion: AddressDetail;

  @Column({ type: 'int', nullable: true })
  capacidad_simultanea: number;

  @Column({ type: 'boolean', default: true })
  requiere_aprobacion_citas: boolean;

  /**
   * Relaciones con entidades de Taller
   */
  @OneToMany(() => TallerServicio, (servicio) => servicio.prestatario)
  serviciosTaller: TallerServicio[];

  @OneToMany(() => TallerHorario, (horario) => horario.prestatario)
  horariosTaller: TallerHorario[];

  @OneToMany(() => CitaTaller, (cita) => cita.taller)
  citasComoTaller: CitaTaller[];

  @OneToMany(() => CitaTaller, (cita) => cita.cliente)
  citasComoCliente: CitaTaller[];
}