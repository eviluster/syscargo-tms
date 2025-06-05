import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { UpdateCuentaBancariaDto } from './update-cuenta-bancaria.dto';
import { CreateCuentaBancariaDto } from './create-cuenta-bancaria.dto';

export class SearchCuentaBancariaDto{
    @IsOptional()
    id?: string;
    @IsOptional()
    beneficiario?: string;
    @IsOptional()
    nombreBanco?: string;
    @IsOptional()
    direccionBanco?: string;
    @IsOptional()
    codigo?: string;
    @IsOptional()
    currency?: string;
    @IsOptional()
    numeroCuenta?: string;
    @IsOptional()
    direccionBeneficiario?: string;   
}

