import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate, IsOptional, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreateModalidadDto extends BaseExtendedDto {
  @IsNotEmpty()
  @IsString()
  detalles: string;

  @ApiProperty({
    isArray: true,
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  caracteristicas: Record<string, any>[];
}
