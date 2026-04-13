import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { Carga } from 'src/carga/entities/carga.entity';

@Entity('doccarga')
export class Doccarga extends BasicInformationEntity {
  @ManyToOne(() => Carga, (carga) => carga.doccargas, {eager: true, nullable:true})
  @JoinColumn({ name: 'carga' })
  carga: Carga;

  @Column()
  file: string;
}
