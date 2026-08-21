import { IsInt, IsString, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTallerHorarioDto {
  @ApiProperty({ description: 'ID del prestatario dueño del taller' })
  @IsString()
  prestatarioId: string;

  @ApiProperty({ description: 'Día de la semana (0=Domingo, 1=Lunes... 6=Sábado)' })
  @IsInt()
  @Min(0)
  @Max(6)
  dia_semana: number;

  @ApiProperty({ description: 'Hora de inicio (formato HH:mm)' })
  @IsString()
  hora_inicio: string;

  @ApiProperty({ description: 'Hora de fin (formato HH:mm)' })
  @IsString()
  hora_fin: string;

  @ApiPropertyOptional({ description: 'Estado activo del horario', default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateTallerHorarioDto {
  @ApiPropertyOptional({ description: 'Hora de inicio (formato HH:mm)' })
  @IsString()
  @IsOptional()
  hora_inicio?: string;

  @ApiPropertyOptional({ description: 'Hora de fin (formato HH:mm)' })
  @IsString()
  @IsOptional()
  hora_fin?: string;

  @ApiPropertyOptional({ description: 'Estado activo del horario' })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class ConsultaDisponibilidadDto {
  @ApiProperty({ description: 'ID del taller' })
  @IsInt()
  @Min(1)
  tallerId: number;

  @ApiProperty({ description: 'Fecha solicitada (YYYY-MM-DD)' })
  @IsString()
  fecha: string;

  @ApiPropertyOptional({ description: 'Duración estimada en minutos', default: 60 })
  @IsInt()
  @Min(1)
  @IsOptional()
  duracion_minutos?: number;
}
