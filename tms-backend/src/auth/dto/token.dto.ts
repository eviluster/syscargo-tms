import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';

export class TokenDto {



  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

}
