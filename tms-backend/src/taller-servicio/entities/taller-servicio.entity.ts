// src/taller-servicio/entities/taller-servicio.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

@Entity('taller_servicio')
export class TallerServicio extends BasicEntity {
  @ManyToOne(() => Prestatario, (prestatario) => prestatario.serviciosTaller, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prestatario_id' })
  prestatario: Prestatario;

  @Column({ type: 'varchar', length: 100 })
  nombre_personalizado: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo_servicio: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio_base: number;

  @Column({ type: 'int', default: 60 })
  tiempo_estimado_minutos: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
