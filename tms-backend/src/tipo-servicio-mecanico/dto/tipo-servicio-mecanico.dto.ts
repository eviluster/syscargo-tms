import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTipoServicioMecanicoDto {
  @ApiProperty({ description: 'Código único del servicio' })
  @IsString()
  codigo: string;

  @ApiProperty({ description: 'Nombre del servicio' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Descripción del servicio' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado activo del catálogo', default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateTipoServicioMecanicoDto {
  @ApiPropertyOptional({ description: 'Nombre del servicio' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción del servicio' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado activo del catálogo' })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
