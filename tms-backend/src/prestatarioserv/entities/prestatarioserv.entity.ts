import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { Carga } from 'src/carga/entities/carga.entity';

@Entity('prestatarioserv')
export class Prestatarioserv extends BasicInformationEntity {

  @ManyToOne(() => Prestatario, (prestatario) => prestatario.servicios,{eager: true, nullable:false})
  @JoinColumn({ name: 'prestatario' })
  prestatario: Prestatario;

  @Column()
  precio: number;

// @OneToMany(() => Carga, (carga) => carga.prestatarioserv)
// cargas: Carga[];
}
