import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class GetUserDto  {
    
    @ApiProperty()
    @IsUUID()
    @IsString()
    id: string;

}
