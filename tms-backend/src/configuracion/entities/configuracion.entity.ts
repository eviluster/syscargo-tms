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

    // Nuevos parámetros de configuración del sistema
    @Column({ nullable: true })
    maxLoginAttempts: number

    @Column({ nullable: true, type: 'integer' })
    lockDurationMinutes: number

    @Column({ nullable: true, type: 'integer' })
    requestTimeoutSeconds: number

    @Column({ nullable: true, type: 'integer' })
    rateLimitRequestsPerMinute: number

    @Column({ nullable: true, type: 'integer' })
    maxFileSizeMB: number

    @Column({ nullable: true })
    maintenanceMode: boolean

    @Column({ nullable: true, type: 'timestamp' })
    maintenanceStartTime: Date

    @Column({ nullable: true, type: 'timestamp' })
    maintenanceEndTime: Date

    @Column({ nullable: true })
    systemVersion: string

    @Column({ nullable: true })
    apiUrl: string

    @Column({ nullable: true })
    frontendUrl: string

    @Column({ nullable: true })
    emailSupport: string

    @Column({ nullable: true })
    phoneSupport: string

    @Column({ nullable: true, type: 'json' })
    securitySettings: any

    @Column({ nullable: true, type: 'json' })
    paymentSettings: any

    @Column({ nullable: true, type: 'json' })
    apiSettings: any
    
    

}
