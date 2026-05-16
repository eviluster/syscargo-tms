import { Entity, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { Servicio } from 'src/servicio/entities/servicio.entity';

@Entity('prestatarioserv')
@Index(['prestatario', 'servicio', 'isActive'], {
  where: '"isActive" = true',
})
export class Prestatarioserv extends BasicInformationEntity {
  @ManyToOne(() => Prestatario, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prestatario_id' })
  prestatario: Prestatario;

  @ManyToOne(() => Servicio, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'servicio_id' })
  servicio: Servicio;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  precio: number;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
