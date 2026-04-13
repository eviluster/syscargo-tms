import { Entity, Column } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';

@Entity('planes')
export class Planes extends BasicInformationEntity {
  @Column()
  precio: number;

  @Column()
  prestatario: boolean;


}
