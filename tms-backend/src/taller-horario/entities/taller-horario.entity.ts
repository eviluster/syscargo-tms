// src/taller-horario/entities/taller-horario.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

@Entity('taller_horario')
export class TallerHorario extends BasicEntity {
  @ManyToOne(() => Prestatario, (prestatario) => prestatario.horariosTaller, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prestatario_id' })
  prestatario: Prestatario;

  @Column({ type: 'integer', default: 0 })
  dia_semana: number; // 0=Domingo, 1=Lunes, ..., 6=Sábado

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
