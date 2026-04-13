
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RulesDto } from 'src/common/base/dto/rules.dto';

export class CreateAddressDetailDto {

  @ApiProperty({ required: true, description: 'Número de casa' })
  @IsString()
  homeNumber: string;

  @ApiProperty({ required: true, description: 'Nombre de la calle' })
  @IsString()
  streetName: string;

  @ApiProperty({ required: true, description: 'Dirección completa' })
  @IsString()
  address: string;

  @ApiProperty({ required: false, description: 'Código postal' })
  @IsOptional()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  municipality_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  rules?: RulesDto
}

