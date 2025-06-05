import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional  } from 'class-validator';

export class SearchComercialDto {
  @ApiProperty({})
  @IsOptional()
  name?:string;
}
