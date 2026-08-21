import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, IsDateString, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoCita } from '../entities/cita-taller.entity';

export class CreateCitaTallerDto {
  @ApiProperty({ description: 'ID del taller (prestatario)' })
  @IsString()
  tallerId: string;

  @ApiProperty({ description: 'ID del servicio a contratar' })
  @IsString()
  servicioId: string;

  @ApiProperty({ description: 'Fecha y hora de inicio de la cita' })
  @IsDateString()
  fecha_hora_inicio: string;

  @ApiPropertyOptional({ description: 'Duración estimada en minutos (si no se proporciona, se usa la del servicio)' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  duracion_minutos?: number;

  @ApiPropertyOptional({ description: 'Notas adicionales del cliente' })
  @IsString()
  @IsOptional()
  notas_adicionales?: string;
}

export class CreateCitaEscatolinaDto extends CreateCitaTallerDto {
  @ApiProperty({ description: 'ID de dirección de origen' })
  @IsString()
  origenId: string;

  @ApiProperty({ description: 'ID de dirección de destino' })
  @IsString()
  destinoId: string;

  @ApiProperty({ description: 'ID del tipo de carga' })
  @IsString()
  tipoCargaId: string;

  @ApiProperty({ description: 'Peso en kg' })
  @IsNumber()
  @Min(0)
  peso_kg: number;

  @ApiProperty({ description: 'Volumen en m³' })
  @IsNumber()
  @Min(0)
  volumen_m3: number;

  @ApiProperty({ description: 'ID del tipo de transporte requerido' })
  @IsString()
  tipoTransporteId: string;

  @ApiProperty({ description: 'Fecha estimada del viaje' })
  @IsDateString()
  fecha_estimada_viaje: string;

  @ApiProperty({ description: 'Licencia operativa del transportista' })
  @IsString()
  licencia_operativa: string;
}

export class ResponderCitaDto {
  @ApiProperty({ description: 'Nueva estado de la cita', enum: EstadoCita, enumName: 'EstadoCita' })
  @IsEnum(EstadoCita)
  estado: EstadoCita;

  @ApiPropertyOptional({ description: 'Motivo de rechazo (requerido si el estado es RECHAZADA)' })
  @IsString()
  @IsOptional()
  motivo_rechazo?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsString()
  @IsOptional()
  notas_adicionales?: string;
}

export class ActualizarEstadoCitaDto {
  @ApiProperty({ description: 'Nuevo estado de la cita', enum: EstadoCita, enumName: 'EstadoCita' })
  @IsEnum(EstadoCita)
  estado: EstadoCita;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsString()
  @IsOptional()
  notas_adicionales?: string;
}

export class ConsultaDisponibilidadCitasDto {
  @ApiProperty({ description: 'ID del taller' })
  @IsString()
  tallerId: string;

  @ApiProperty({ description: 'Fecha de inicio del rango (YYYY-MM-DD)' })
  @IsDateString()
  fecha_inicio: string;

  @ApiProperty({ description: 'Fecha fin del rango (YYYY-MM-DD)' })
  @IsDateString()
  fecha_fin: string;

  @ApiPropertyOptional({ description: 'ID del servicio para filtrar por duración' })
  @IsString()
  @IsOptional()
  servicioId?: string;
}
