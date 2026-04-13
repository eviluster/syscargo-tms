import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { RulesDto } from "./rules.dto";

export class BasicExtendedDto {

    @ApiProperty({type: String})
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    rules?: RulesDto;
}

