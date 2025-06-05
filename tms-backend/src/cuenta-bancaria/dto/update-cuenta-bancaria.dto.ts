import { PartialType } from '@nestjs/swagger';
import { CreateCuentaBancariaDto } from './create-cuenta-bancaria.dto';
import { IsOptional, IsString } from 'class-validator';
import { IsUUID } from 'class-validator';

export class UpdateCuentaBancariaDto extends PartialType(CreateCuentaBancariaDto) {
    @IsUUID()
    @IsString()
    @IsOptional()
    id?: string;

}
