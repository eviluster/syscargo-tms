import { Entity, Column } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';

@Entity('modalidad')
export class Modalidad extends BasicInformationEntity {
  @Column()
  detalles: string;

  @Column('json',{nullable:true})
  caracteristicas: Record<string, any>
}
