import { Entity, Column } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';

@Entity('tipocarga')
export class Tipocarga extends BasicInformationEntity {
  @Column({ nullable: true })
  descripcion: string;
}
