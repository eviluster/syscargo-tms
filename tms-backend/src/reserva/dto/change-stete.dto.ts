import { ApiProperty } from "@nestjs/swagger";
import { StateEnum } from "../enum/state.enum";
import { IsEnum, IsString, IsUUID } from "class-validator";

export class ChangeStateDto {

    @ApiProperty()
    @IsUUID()
    @IsString()
    id: string;
    
    @ApiProperty()
    @IsEnum(StateEnum)
    state: StateEnum;
  
  }