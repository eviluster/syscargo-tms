import { Entity } from 'typeorm';
import { JuridicPerson } from '../../common/base/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity('proveedores')
export class Proveedor extends JuridicPerson {
  @ApiProperty({ })
  name: string;

  @ApiProperty({ })
  description: string;
}
