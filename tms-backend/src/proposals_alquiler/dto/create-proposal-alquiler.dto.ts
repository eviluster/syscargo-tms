// src/proposals-alquiler/dto/create-proposal-alquiler.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateProposalAlquilerDto {
  @ApiProperty({
    description: 'ID del prestatario al que se propone la solicitud',
    example: '617f3176-e146-4872-b741-66e487341786',
  })
  @IsUUID()
  prestatarioId!: string;

  @ApiPropertyOptional({
    description: 'Mensaje o notas opcionales para el prestatario',
    example:
      'Hola, te propongo esta solicitud porque encaja con tu disponibilidad.',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
