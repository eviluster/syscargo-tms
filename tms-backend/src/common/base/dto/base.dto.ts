import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { RulesDto } from './rules.dto';

export class BaseExtendedDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({})
  name: string;

  @ApiProperty({})
  description: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ required: false })
  @IsOptional()
  rules?: RulesDto;
}
export class BaseStringDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ required: false })
  @IsOptional()
  rules?: RulesDto;
}
