import { Entity, OneToMany } from 'typeorm';
import { Um } from 'src/um/entities/um.entity';
import { ExtendedEntity } from 'src/common/base/entities';

@Entity('tipos_um')
export class TipoUm extends ExtendedEntity {
  @OneToMany(() => Um, (Um) => Um.tipoUm)
  ums: Um[];
}
