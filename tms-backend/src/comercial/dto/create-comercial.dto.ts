import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreateComercialDto extends BaseExtendedDto{
   
  @ApiProperty({ description: 'Apellido' })
  @IsString()
  apellido: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @IsString()
  @IsEmail()
  correo: string;

  @ApiProperty({ description: 'Número de teléfono' })
  @IsString()
  telefono: string;

}


