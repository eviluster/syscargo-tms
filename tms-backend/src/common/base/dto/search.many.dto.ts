import { IsArray, IsNumber, IsObject, IsOptional } from "class-validator";

import { Repository } from "typeorm";
import { fieldsEnum } from "src/common/enum/fields.enum";
import { ApiProperty } from "@nestjs/swagger";
import { OrderDto } from "./order.dto";

export class SearchManyDto {

  @ApiProperty()
  queryType: fieldsEnum;
  id: string;
  repo: Repository<any>;

  @IsOptional()
  @IsArray()
  select?: string[];

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  take?: number;
}
