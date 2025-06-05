import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProveedorDto } from './create-proveedor.dto';
import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { RulesDto } from 'src/common/base/dto/rules.dto';

export class UpdateProveedorDto extends PartialType(CreateProveedorDto) {
    @ApiProperty()
    @IsString()
    @IsUUID()
    id: string;  
  
    @ApiProperty()
    @IsNotEmpty()
    rules: RulesDto
}
