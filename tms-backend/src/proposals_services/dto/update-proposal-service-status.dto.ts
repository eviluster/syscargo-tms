// src/proposals_services/dto/update-proposal-service-status.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateProposalServiceStatusDto {
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  message?: string;
}
