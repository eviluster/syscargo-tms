// src/settings/dto/create-update-setting.dto.ts
import { IsIn, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateSettingDto {
  @ApiProperty({
    description: 'Clave única de la configuración',
    example: 'pricing_rules',
  })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    required: false,
    description: 'Valor. Para type=json enviar un JSON stringificado o null.',
    example: 'Contenido en markdown o html o string.',
  })
  @IsOptional()
  value?: string | null;

  @ApiProperty({
    required: false,
    enum: ['string', 'html', 'markdown', 'json'],
    example: 'markdown',
  })
  @IsOptional()
  @IsString()
  @IsIn(['string', 'html', 'markdown', 'json'])
  type?: 'string' | 'html' | 'markdown' | 'json';
}
