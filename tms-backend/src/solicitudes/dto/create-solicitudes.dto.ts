// src/solicitudes/dto/create-solicitudes.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
  IsDateString,
  IsArray,
  IsUUID,
  IsInt,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty()
  solicitante: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  metros_requeridos?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tipo_uso?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  altura_m?: number;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  // nuevo: fecha fin para servicios que la requieran
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsString()
  duracion?: string;

  @IsOptional()
  @IsString()
  acceso_horario?: string;

  @IsOptional()
  @IsString()
  control_temperatura?: string;

  @IsOptional()
  @IsArray()
  servicios?: string[];

  @IsOptional()
  @IsString()
  frecuencia?: string;

  @IsOptional()
  @IsString()
  clasificacion_mercancia?: string;

  @IsOptional()
  @IsString()
  comentarios?: string;

  // alojamiento
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  habitaciones_requeridas?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  personas?: number;

  // gps
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  device_count?: number;

  @IsOptional()
  @IsString()
  plan?: string;

  // taller
  @IsOptional()
  @IsString()
  vehiculo_marca?: string;

  @IsOptional()
  @IsString()
  vehiculo_placa?: string;

  // NUEVOS: servicio y creador (prestatario)
  @IsOptional()
  @IsString()
  serviceRequested?: string;

  @IsOptional()
  @IsUUID()
  createdByPrestatarioId?: string;

  // Relaciones (opcional en creación)
  @IsOptional()
  @IsUUID()
  cliente_id?: string;

  @IsOptional()
  @IsUUID()
  assigned_prestatario_id?: string;
}
