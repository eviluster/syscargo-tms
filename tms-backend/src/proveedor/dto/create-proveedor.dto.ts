import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';

export class CreateProveedorDto  extends BaseExtendedDto{

  @ApiProperty({
    description: 'Dirección',
    example: { street: '123 Main St', city: 'City' },
  })
  @IsNotEmpty()
  readonly direccion: string[];

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'user@example.com',
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray({})
  readonly email: string[];

  @ApiProperty({
    description: 'Teléfono',
    example: '+1 123-456-7890',
    isArray: true,
  })
  @IsNotEmpty()
  readonly phone: JSON;
}
