import { BasicEntity } from "src/common/base/entities";
import { Column, Entity } from "typeorm";
@Entity('configuracion')
export class Configuracion extends BasicEntity {

    @Column()
    from: string    

    @Column()
    to: string    

    @Column()
    porcientoConfReserva: number

    @Column()
    porcientoMinPrice: number
    @Column()
    impuesto: number
    
    

}
