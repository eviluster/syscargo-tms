import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { Origen } from 'src/origen/entities/origen.entity';
import { Destino } from 'src/destino/entities/destino.entity';
import { Doccarga } from 'src/doccarga/entities/doccarga.entity';
import { Prestatarioserv } from 'src/prestatarioserv/entities/prestatarioserv.entity';
import { TipoCargaEnum } from '../enum/tipo-carga.enum';

@Entity('carga')
export class Carga extends BasicInformationEntity {
  @Column({unique: true})
  order_id: string;
  
  @Column({unique: true})
  carga_serie: string;
  
  @Column()
  remitente_dni: string;

  @Column()
  remitente_nombre: string;

  @Column()
  direccion: string;

  @Column()
  emisor_dni: string;

  @Column()
  emisor_nombre: string;

  @Column()
  emisor_direccion: string;

  @Column()
  cant_bultos: number;

  @Column()
  peso_total: number;

  @Column()
  vol_bulto: number;

  @ManyToOne(() => Origen, (origen) => origen.cargas, {eager: true, nullable:true})
  @JoinColumn({ name: 'origen' })
  origen: Origen;

  @ManyToOne(() => Destino, (destino) => destino.cargas, {eager: true, nullable:true})
  @JoinColumn({ name: 'destino' })
  destino: Destino;

 @Column()
 origen_string: string;

 @Column()
 destino_string: string;

  @Column()
  autorizado_recoger: string;

  @Column()
  tipo_carga: TipoCargaEnum;

@OneToMany(() => Doccarga, (doccarga) => doccarga.carga)
doccargas: Doccarga[];

// @ManyToOne(() => Prestatarioserv, (prestatarioserv) => prestatarioserv.cargas, {eager: true, nullable: true})
// @JoinColumn({ name: 'prestatarioserv' })
// prestatarioserv: Prestatarioserv;

@Column()
precio: number;
@Column()
tarifabase: number;
@Column()
volumen: number;
@Column()
impuesto: number;
@Column()
comision: number;

}
