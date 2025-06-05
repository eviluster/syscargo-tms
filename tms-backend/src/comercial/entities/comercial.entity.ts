import { BasicInformationEntity } from "src/common/base/entities";
import { Column, Entity } from "typeorm";

@Entity('comercial')
export class Comercial extends BasicInformationEntity{
    @Column()
    apellido:string
    @Column()
    correo:string
    @Column()
    telefono:string
}
