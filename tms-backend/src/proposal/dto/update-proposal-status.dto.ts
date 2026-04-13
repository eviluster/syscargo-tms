// src/proposal/dto/update-proposal-status.dto.ts
import { IsIn, IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateProposalStatusDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsObject()
  vehicle?: Record<string, any>;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'accepted', 'rejected', 'cancelled', 'confirmed'])
  status?: string;
}
