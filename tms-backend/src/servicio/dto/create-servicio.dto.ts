import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsString, Min, MinLength } from "class-validator";
import { BaseExtendedDto } from "src/common/base/dto/base.dto";

export class CreateServicioDto  extends BaseExtendedDto {
    @IsBoolean()    
    prestatario: boolean;

}
