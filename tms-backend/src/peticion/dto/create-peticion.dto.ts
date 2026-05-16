import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePeticionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreEntidad: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreCarga: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  peso: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  volumen?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  origen: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destino: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tipoCarga: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  via?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  origenDireccion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  destinoDireccion?: string;

  /** UUID del prestatario (transportista terrestre) */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  transportistaId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  distanciaKm?: number;
}
