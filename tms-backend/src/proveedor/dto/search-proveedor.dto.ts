import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchProveedorDto {
  @ApiProperty({ })
  @IsOptional()
  name?: string;

  @ApiProperty({ })
  @IsOptional()
  description?: string;
  }
