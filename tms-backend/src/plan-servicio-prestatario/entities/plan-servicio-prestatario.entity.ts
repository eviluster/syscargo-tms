import { BasicEntity } from "src/common/base/entities";
import { Planes } from "src/planes/entities/planes.entity";
import { Servicio } from "src/servicio/entities/servicio.entity";
import { Entity, JoinColumn, ManyToMany } from "typeorm";
@Entity('plan-servicio-prestatario')
export class PlanServicioPrestatario extends BasicEntity{

    @ManyToMany(() => Planes)
    // , (cuenta) => cuenta.customers)
    @JoinColumn({ name: 'planes_id' })
    planes_id: Planes;

    @ManyToMany(() => Servicio)
    // , (cuenta) => cuenta.customers)
    @JoinColumn({ name: 'servicio_id' })
    servicio_id: Servicio; 
}
