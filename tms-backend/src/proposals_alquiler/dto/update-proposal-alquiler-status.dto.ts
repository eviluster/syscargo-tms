// src/proposals-alquiler/dto/update-proposal-alquiler-status.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const PROPOSAL_ALQUILER_STATUSES = [
  'pending',
  'accepted',
  'rejected',
  'confirmed',
  'cancelled',
] as const;

export type ProposalAlquilerStatus =
  (typeof PROPOSAL_ALQUILER_STATUSES)[number];

export class UpdateProposalAlquilerStatusDto {
  @ApiPropertyOptional({
    description: `Nuevo estado de la propuesta. Valores permitidos: ${PROPOSAL_ALQUILER_STATUSES.join(
      ', ',
    )}`,
    example: 'accepted',
    enum: PROPOSAL_ALQUILER_STATUSES,
  })
  @IsString()
  @IsIn(PROPOSAL_ALQUILER_STATUSES as unknown as string[])
  status!: ProposalAlquilerStatus;

  @ApiPropertyOptional({
    description: 'Mensaje/razón opcional (por ejemplo motivo de rechazo)',
    example: 'No tengo espacio disponible',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
