import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { BaseExtendedDto } from "src/common/base/dto/base.dto";

export class CreateLocalityDto  extends BaseExtendedDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    municipality_id: string;
}
