import { Entity, ManyToOne } from 'typeorm';
import { TipoUm } from 'src/tipo-um/entities/tipo-um.entity';
import { ExtendedEntity } from 'src/common/base/entities';

@Entity('um')
export class Um extends ExtendedEntity {
  @ManyToOne(() => TipoUm, (tipoUm) => tipoUm.ums)
  tipoUm: TipoUm;
}
