// src/tipo-servicio-mecanico/entities/tipo-servicio-mecanico.entity.ts
import { Entity, Column } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';

@Entity('tipo_servicio_mecanico')
export class TipoServicioMecanico extends BasicEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  tiempo_estimado_minutos: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
