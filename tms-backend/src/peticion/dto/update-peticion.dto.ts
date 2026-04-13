// update-peticion.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePeticionDto {
  @IsOptional()
  @IsString()
  nombreEntidad?: string;

  @IsOptional()
  @IsString()
  nombreCarga?: string;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsNumber()
  volumen?: number;

  @IsOptional()
  @IsString()
  origen?: string;

  @IsOptional()
  @IsString()
  destino?: string;

  @IsOptional()
  @IsString()
  tipoCarga?: string;
}
