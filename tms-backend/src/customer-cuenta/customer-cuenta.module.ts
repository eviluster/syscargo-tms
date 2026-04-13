import { Module } from '@nestjs/common';
import { CustomerCuentaService } from './customer-cuenta.service';
import { CustomerCuentaController } from './customer-cuenta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerCuenta } from './entities/customer-cuenta.entity';
import { CustomerModule } from 'src/customer/customer.module';
import { CuentaBancariaModule } from 'src/cuenta-bancaria/cuenta-bancaria.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerCuenta]),
  CustomerModule,
  CuentaBancariaModule],
  controllers: [CustomerCuentaController],
  providers: [CustomerCuentaService],
  exports: [CustomerCuentaService],
})
export class CustomerCuentaModule {}
