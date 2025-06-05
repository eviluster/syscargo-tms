import { PartialType } from '@nestjs/swagger';
import { CreateCustomerCuentaDto } from './create-customer-cuenta.dto';

export class UpdateCustomerCuentaDto extends PartialType(CreateCustomerCuentaDto) {}
