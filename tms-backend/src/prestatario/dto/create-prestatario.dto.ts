// src/prestatario/dto/create-prestatario.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { TipoCarga, Contenedor } from '../entities/prestatario.entity';
import { ViaMode } from 'src/carga/enum/vias';

export class TransporteDto {
  @IsString()
  @IsNotEmpty()
  nombreChofer: string;

  @IsString()
  @IsNotEmpty()
  chapa: string;

  @IsString()
  @IsNotEmpty()
  tipoTransporte: string;
}

export class AyudanteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsOptional()
  @IsString()
  ci?: string;
}

export class LicenciaDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsDateString()
  vence: string;
}

export class CreatePrestatarioDto {
  @IsOptional()
  @IsEnum(TipoCarga)
  tipoCarga?: TipoCarga;

  @IsOptional()
  @IsEnum(Contenedor)
  contenedor?: Contenedor;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxWeight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxVolume?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransporteDto)
  transportes?: TransporteDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AyudanteDto)
  ayudantes?: AyudanteDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cargasEspeciales?: string[];

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LicenciaDto)
  licencia?: LicenciaDto;

  @IsOptional()
  @IsArray()
  @IsEnum(ViaMode, { each: true })
  servicios?: ViaMode[];

  @IsOptional()
  @IsString()
  conditions?: string;

  // ---------------------
  // Alquiler (camelCase)
  // ---------------------
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  metrosDisponiblesAlquiler?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  alturaMAlquiler?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviciosPrestAlquiler?: string[];

  // ---------------------
  // Talleres (camelCase)
  // ---------------------
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  talleresNumTecnicos?: number;

  @IsOptional()
  @IsString()
  talleresHorario?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  talleresServicios?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  talleresCapacidadVehiculos?: number;

  // ---------------------
  // GPS (camelCase)
  // ---------------------
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gpsProviders?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gpsDevicesAvailable?: number;

  @IsOptional()
  @IsString()
  gpsPlans?: string;

  @IsOptional()
  @IsBoolean()
  gpsIntegrationApi?: boolean;

  // ---------------------
  // Alojamiento (camelCase)
  // ---------------------
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  habitacionesDisponibles?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  capacidadPersonas?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  precioNochePromedio?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tipoHabitaciones?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviciosIncluidosAlojamiento?: string[];
}
