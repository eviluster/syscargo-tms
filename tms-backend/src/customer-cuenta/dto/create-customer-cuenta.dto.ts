import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { BaseExtendedDto } from "src/common/base/dto/base.dto";

export class CreateCustomerCuentaDto  extends BaseExtendedDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    cuentaBancaria: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    customer: string;
}
