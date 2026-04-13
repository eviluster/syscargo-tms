import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class LogOutDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
