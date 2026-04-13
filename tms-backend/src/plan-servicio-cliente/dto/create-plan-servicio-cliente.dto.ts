import { IsString, IsUUID } from "class-validator";
import { BaseExtendedDto } from "src/common/base/dto/base.dto";
import { BasicExtendedDto } from "src/common/base/dto/basic.dto";

export class CreatePlanServicioClienteDto extends BasicExtendedDto {
   
    @IsUUID()
    @IsString()
    servicio_id: string;

    @IsUUID()
    @IsString()
    plan_id: string;
}
