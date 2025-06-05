
import { BasicEntity } from "src/common/base/entities";
import { Column, Entity } from "typeorm";
@Entity('cuenta_bancaria')
export class CuentaBancaria extends BasicEntity {
    @Column({})
    beneficiario:string

    @Column({})
    direccionBeneficiario:string
    
    @Column({})
    nombreBanco:string
        
    @Column({})
    direccionBanco:string
            
    @Column({})
    codigo:string
                
    @Column({
    type: "enum",
    enum: ["USD", "EUR"]
    })
    currency: "USD" | "EUR"
 
                
    @Column({})
    numeroCuenta:string
   
}
