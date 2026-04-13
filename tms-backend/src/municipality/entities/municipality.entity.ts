import { AddressDetail } from 'src/address-details/entities/address-detail.entity';
import { ExtendedEntity } from 'src/common/base/entities';
import { Locality } from 'src/locality/entities/locality.entity';
import { Province } from 'src/province/entities/province.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity('municipality')
export class Municipality extends ExtendedEntity {
  @ManyToOne(() => Province, (province) => province.municipalities, {
    eager: false,
  })
  @JoinColumn({ name: 'province_id' })
  province_id: Province;

  @OneToMany(() => Locality, (locality) => locality.municipality_id, {
    cascade: false,
  })
  localities: Locality[];

  // @Column({ default: false })
  // isCapital: boolean;

  @OneToMany(
    () => AddressDetail,
    (addressDetails) => addressDetails.municipality_id,
  )
  addresses: AddressDetail[];
}
