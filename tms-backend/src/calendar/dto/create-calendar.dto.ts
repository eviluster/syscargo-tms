import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsDate,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreateCalendarDto extends BaseExtendedDto {
  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @IsNotEmpty()
  @IsNumber()
  inicio: number;

  @IsOptional()
  @IsNumber()
  fin?: number;

  @IsNotEmpty()
  @IsBoolean()
  fullDay: boolean;

  @IsUUID()
  @IsString()
  @IsOptional()
  user?: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsBoolean()
  isService: boolean;
}
