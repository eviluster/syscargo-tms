import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class SearchProvinceDto {
  @ApiProperty({  })
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isCapital?: boolean;

  }
