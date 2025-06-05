import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SearchMunicipalityDto {
  @ApiProperty({})
  @IsOptional()
  name?:string;

  @ApiProperty({})
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsOptional()
  province?: string;

  // @ApiProperty({ type: () => MultilanguageDto })
  // @IsOptional()
  // provinceName?: MultilanguageDto = { es: null, en: null };
  }
