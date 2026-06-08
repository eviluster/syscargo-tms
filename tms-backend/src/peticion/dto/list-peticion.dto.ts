import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListPeticionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tipoCarga?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  clienteId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  offset?: string;
}
