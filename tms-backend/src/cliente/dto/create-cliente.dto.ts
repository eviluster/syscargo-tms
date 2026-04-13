import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contact_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tax_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  // Nuevo campo modalidad
  @ApiProperty({
    required: false,
    description: 'Modalidad del cliente (ej: terrestre, marítima, aérea, etc.)',
  })
  @IsOptional()
  @IsString()
  modalidad?: string;
}
