import { ApiProperty } from '@nestjs/swagger';
import { RelationalDto } from '../../common/base/dto/relational.dto';
import { Type } from 'class-transformer';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';
import { IsString, IsUUID } from 'class-validator';

export class CreateUmDto  extends BaseExtendedDto{

  @Type(() => RelationalDto)
  @ApiProperty({
    type: RelationalDto,
  })
  @IsString()
  @IsUUID()
  @ApiProperty()
  tipoUm: string;
  
}
