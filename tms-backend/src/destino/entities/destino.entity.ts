import { Entity, Column, OneToMany } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { Carga } from 'src/carga/entities/carga.entity';

@Entity('destino')
export class Destino extends BasicInformationEntity {

@OneToMany(() => Carga, (carga) => carga.destino)
cargas: Carga[];
}
