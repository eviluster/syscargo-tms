import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SearchUmDto {
  @ApiProperty({  })
  @IsOptional()
  name?: string;

  @ApiProperty({  })
  @IsOptional()
  description?: string;
  
  @IsUUID()
  @ApiProperty()
  @IsString()
  @IsOptional()  
  tipoUm?: string;
}
