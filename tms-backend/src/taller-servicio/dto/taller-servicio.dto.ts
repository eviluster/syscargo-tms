import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTallerServicioDto {
  @ApiProperty({ description: 'ID del prestatario dueño del taller' })
  @IsString()
  prestatarioId: string;

  @ApiProperty({ description: 'Nombre personalizado del servicio' })
  @IsString()
  @IsOptional()
  nombre_personalizado?: string;

  @ApiProperty({ description: 'Tipo de servicio estándar (código)' })
  @IsString()
  tipo_servicio: string;

  @ApiProperty({ description: 'Precio base del servicio' })
  @IsNumber()
  @Min(0)
  precio_base: number;

  @ApiProperty({ description: 'Tiempo estimado en minutos' })
  @IsNumber()
  @Min(1)
  tiempo_estimado_minutos: number;

  @ApiPropertyOptional({ description: 'Estado activo del servicio', default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateTallerServicioDto {
  @ApiPropertyOptional({ description: 'Nombre personalizado del servicio' })
  @IsString()
  @IsOptional()
  nombre_personalizado?: string;

  @ApiPropertyOptional({ description: 'Tipo de servicio estándar (código)' })
  @IsString()
  @IsOptional()
  tipo_servicio?: string;

  @ApiPropertyOptional({ description: 'Precio base del servicio' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  precio_base?: number;

  @ApiPropertyOptional({ description: 'Tiempo estimado en minutos' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  tiempo_estimado_minutos?: number;

  @ApiPropertyOptional({ description: 'Estado activo del servicio' })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
