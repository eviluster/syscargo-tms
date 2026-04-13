import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class ReprogramDto {
  @IsNotEmpty()
  @IsDateString()
  date: string; // ISO date

  @IsNotEmpty()
  @IsString()
  reason: string;
}
