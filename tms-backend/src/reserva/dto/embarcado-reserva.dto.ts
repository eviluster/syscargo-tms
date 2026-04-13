import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { BaseExtendedDto } from "src/common/base/dto/base.dto";

export class EmbarcadoReservaDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    bl: string;

    @IsString()
    @IsNotEmpty()
    contenedor: string;
}
