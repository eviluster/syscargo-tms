import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreateCountryDto extends BaseExtendedDto {

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsInt()
  numericCode: number;

}
