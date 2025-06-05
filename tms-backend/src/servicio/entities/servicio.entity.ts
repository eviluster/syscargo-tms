import { BasicInformationEntity } from "src/common/base/entities";
import { Column, Entity } from "typeorm";
@Entity ('servicio')
export class Servicio extends BasicInformationEntity {
    @Column()
    prestatario: boolean;

}
