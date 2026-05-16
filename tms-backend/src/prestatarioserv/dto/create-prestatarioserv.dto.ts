import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreatePrestatarioservDto extends BaseExtendedDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'UUID del prestatario' })
  prestatario: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'UUID del servicio' })
  servicio: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({ description: 'Precio del servicio (debe ser > 0)' })
  precio: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Descripción opcional' })
  descripcion?: string;
}
