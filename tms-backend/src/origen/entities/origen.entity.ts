import { Entity, Column, OneToMany } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { Carga } from 'src/carga/entities/carga.entity';

@Entity('origen')
export class Origen extends BasicInformationEntity {

@OneToMany(() => Carga, (carga) => carga.origen)
cargas: Carga[];
}
