import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreatePrestatarioservDto extends BaseExtendedDto {
  @IsNotEmpty()
  @IsString()
  prestatario: string;

  @IsNotEmpty()
  @IsNumber()
  precio: number;
}
