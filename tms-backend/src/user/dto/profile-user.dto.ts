import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class ProfileUserDto {

  id: string;

  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 12,
      minLowercase: 2,
      minNumbers: 2,
      minSymbols: 2,
      minUppercase: 2,
    },
    {
      message: 'Password must contain at least two lowercase letter, two uppercase letter, two number, and two symbol.',
    },
  )
  password: string;


  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 12,
      minLowercase: 2,
      minNumbers: 2,
      minSymbols: 2,
      minUppercase: 2,
    },
    {
      message: 'Password must contain at least two lowercase letter, two uppercase letter, two number, and two symbol.',
    },
  )
  confirmationPassword: string;

  hash?: string;
}
