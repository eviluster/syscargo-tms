import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUmDto } from './create-um.dto';
import { RulesDto } from '../../common/base/dto/rules.dto';
import { KindEnum } from '../../common/enum/kind.enum';
import { MethodEnum } from '../../common/enum/method.enum';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateUmDto extends PartialType(CreateUmDto) {
  @IsString()
  @IsUUID()
  @ApiProperty()
  id: string;  
  
  @ApiProperty({
    type: RulesDto
  })
  @IsNotEmpty()
  rules: RulesDto 
}
