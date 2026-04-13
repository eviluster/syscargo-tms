// src/proposals_services/dto/create-proposal-service.dto.ts
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProposalServiceDto {
  @IsOptional()
  @IsUUID()
  prestatarioId?: string;

  @IsOptional()
  @IsUUID()
  solicitudId?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
