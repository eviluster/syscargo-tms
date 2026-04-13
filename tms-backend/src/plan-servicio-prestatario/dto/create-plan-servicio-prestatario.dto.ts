import { IsUUID } from "class-validator";
import { BasicExtendedDto } from "src/common/base/dto/basic.dto";

export class CreatePlanServicioPrestatarioDto extends BasicExtendedDto{

    @IsUUID()   
    planes_id: string;
    
    @IsUUID()   
    servicio_id: string;
}
