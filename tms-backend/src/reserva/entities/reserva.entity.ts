import { Comercial } from "src/comercial/entities/comercial.entity";
import { BasicInformationEntity } from "src/common/base/entities";
import { Column, Entity, ManyToOne } from "typeorm";
import { StateEnum } from "../enum/state.enum";
import { User } from "src/user/entities/user.entity";
import { Servicio } from "src/servicio/entities/servicio.entity";

@Entity('reserva')
export class Reserva extends BasicInformationEntity{

    @Column()
    apellido:string
    @Column()
    correo:string
    @Column()
    fecha:string
    @Column()
    hora:string
    @Column()
    direccion:string

    @ManyToOne(() => Comercial, { nullable:true})
    // (comercial) => comercial.reservas, 
    comercial: Comercial;
    


    @Column({ type: 'enum', enum: StateEnum, default: StateEnum.Ordenado })
    state: StateEnum;
    //  Para Pasar a producido
    @Column({ type: 'varchar', nullable: true })
    vin: string;
    @Column({ type: 'varchar', nullable: true })
    motor: string;

    //  Para Pasar a embarcado
    @Column({ type: 'varchar', nullable: true })
    bl: string;
    @Column({ type: 'varchar', nullable: true })
    contenedor: string;

    // Agregar estos datos aca para si es servicio
    // nombre solicitante
    @Column({ type: 'varchar', nullable: true })
    nombreSolicitante: string;
    // correo solicitante
    @Column({ type: 'varchar', nullable: true })
    correoSolicitante: string;
    // telefono solicitante
    @Column({ type: 'varchar', nullable: true })
    telefonoSolicitante: string;

    @ManyToOne(() => Servicio, { eager: true, nullable: true })
    servicio: Servicio;

    @Column({ type: 'varchar', nullable: true })
    fechaSolicitud: string;
    @Column({ type: 'varchar', nullable: true })
    comentarios: string;

    @ManyToOne(() => User, { nullable: false, eager: true })
    user: User;

}
