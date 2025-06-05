import { BasicInformationEntity } from "src/common/base/entities";
import { CuentaBancaria } from "src/cuenta-bancaria/entities/cuenta-bancaria.entity";
import { Customer } from "src/customer/entities/customer.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('customer_cuenta')
export class CustomerCuenta extends BasicInformationEntity{
@ManyToOne(() => Customer, {eager:true})
// , (customer) => customer.cuentas)
@JoinColumn({ name: 'customer_id' })
customer: Customer;

@ManyToOne(() => CuentaBancaria)
// , (cuenta) => cuenta.customers)
@JoinColumn({ name: 'cuenta_bancaria_id' })
cuentaBancaria: CuentaBancaria;
}
