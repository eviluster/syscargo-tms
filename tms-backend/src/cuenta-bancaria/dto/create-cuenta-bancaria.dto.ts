export class CreateCuentaBancariaDto {}

import { IsEnum, IsString } from 'class-validator';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreateEntityDto  extends BaseExtendedDto {
  @IsString()
  beneficiario: string;

  @IsString()
  direccionBeneficiario: string;

  @IsString()
  nombreBanco: string;

  @IsString()
  direccionBanco: string;

  @IsString()
  codigo: string;

  @IsEnum(['USD', 'EUR'])
  currency: 'USD' | 'EUR';

  @IsString()
  numeroCuenta: string;


}

