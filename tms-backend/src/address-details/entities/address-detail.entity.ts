import { ExtendedEntity } from 'src/common/base/entities';
import { Municipality } from 'src/municipality/entities/municipality.entity';
import { Column, ManyToOne, JoinColumn, Entity } from 'typeorm';

@Entity('address_details')
export class AddressDetail extends ExtendedEntity {
  @Column({ nullable: true })
  homeNumber: string;

  @Column({ nullable: true })
  streetName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  postalCode: string;

  @ManyToOne(() => Municipality, (m) => m.addresses, {
    eager: false,
  })
  @JoinColumn({ name: 'municipality_id' })
  municipality_id: Municipality;

  // @OneToMany(() => User, (users) => users.addressDetails)
  // user: User[]
}
