import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class SendMailDto  {
    
    @ApiProperty()
    @IsString()
    from: string;
    
    @ApiProperty()
    @IsString()
    message: string;

}
