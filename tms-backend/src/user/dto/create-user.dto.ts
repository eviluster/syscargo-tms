// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoCarga {
  SECO = 'Seco',
  REFRIGERADO = 'Refrigerado',
  CARGA_GENERAL = 'Carga general',
}

export enum Contenedor {
  C20 = '20',
  C40 = '40',
}

export class TransporteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombreChofer: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chapa: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tipoTransporte: string;
}

export class LicenciaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiProperty({
    description: 'Fecha de vencimiento en formato ISO (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  vence: string;
}

export class AyudanteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ci: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña con complejidad fuerte' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: 'weak',
    },
  )
  password: string;

  @ApiProperty({ description: 'UUID del rol (opcional)' })
  @IsString()
  @IsUUID()
  @IsOptional()
  role?: string;

  // campo interno (hash), no validación ni ApiProperty obligatorio
  hash?: string;
}
