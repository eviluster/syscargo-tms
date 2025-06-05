import { BasicInformationEntity } from "src/common/base/entities";
import { Planes } from "src/planes/entities/planes.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
@Entity('customer')
export class Customer extends BasicInformationEntity {

    @Column({nullable: true})
    email: string;

    @Column({nullable: true})
    addessLineOne: string;

    @Column({nullable: true})
    addessLineTwo: string;

    @Column({nullable: true})
    cityTown: string;

    @Column({nullable: true})
    postalCode: string;

    @ManyToOne(() => Planes, { eager: true })
    // , (cuenta) => cuenta.customers)
    @JoinColumn({ name: 'planes_id' })
    planes: Planes;

}
