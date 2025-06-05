import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreateCalendarDto extends BaseExtendedDto {
  @IsNotEmpty()
  @IsDate()
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

  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  state: string;
}
