import { BasicEntity } from "src/common/base/entities";
import { Planes } from "src/planes/entities/planes.entity";
import { Servicio } from "src/servicio/entities/servicio.entity";
import { JoinColumn, ManyToOne, ManyToMany, Entity } from "typeorm";

@Entity('plan-servicio-cliente')
export class PlanServicioCliente extends BasicEntity {

    @ManyToOne(() => Servicio)
    // , (cuenta) => cuenta.customers)
    @JoinColumn({ name: 'servicio_id' })
    servicio_id: Servicio;

    
    @ManyToOne(() => Planes)
    // , (cuenta) => cuenta.customers)
    @JoinColumn({ name: 'plan_id' })
    plan_id: Planes;
}
