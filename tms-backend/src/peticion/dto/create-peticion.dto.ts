import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePeticionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreEntidad: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreCarga: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  peso: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  volumen?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  origen: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destino: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tipoCarga: string;
}
