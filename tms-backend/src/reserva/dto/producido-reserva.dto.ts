import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { BaseExtendedDto } from "src/common/base/dto/base.dto";

export class ProducidoReservaDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    vin: string;

    @IsString()
    @IsNotEmpty()
    motor: string;
}
