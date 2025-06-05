import { Entity, Column, OneToMany } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { Prestatarioserv } from 'src/prestatarioserv/entities/prestatarioserv.entity';

@Entity('prestatario')
export class Prestatario extends BasicInformationEntity {
  @Column({ unique: true })
  correo: string;

  @Column()
  address: string;

  @Column()
  municipality_id: string;

  @Column()
  telef: string;

@OneToMany(() => Prestatarioserv, (prestatarioserv) => prestatarioserv.prestatario)
servicios: Prestatarioserv[];
}
