import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ChangeStateDto } from './dto/change-stete.dto';
import { ReturnDto } from 'src/common/base/dto';
import { ProducidoReservaDto } from './dto/producido-reserva.dto';
import { EmbarcadoReservaDto } from './dto/embarcado-reserva.dto';

@Controller('reserva')
export class ReservaController extends BaseControllerCRUD<
CreateReservaDto,
UpdateReservaDto,
ReservaService
> {
  constructor(private readonly Service: ReservaService) {
    super(Service);
  }
  
  @Patch('producido')
  async producido(
   @Body() dto: ProducidoReservaDto,
  //  @GetUserEmployee() user: User
 ): Promise<ReturnDto> {
    return this.Service.producido(dto);
  }

  @Patch('embarcado')
  async embarcado(
    @Body() dto: EmbarcadoReservaDto,
   //  @GetUserEmployee() user: User
  ): Promise<ReturnDto> {
     return this.Service.embarcado(dto);
   }

  // @UseGuards(JwtGuard)  
  @Patch('chage-state')
  async changeState(
   @Body() dto: ChangeStateDto,
  //  @GetUserEmployee() user: User
 ): Promise<ReturnDto> {
    return this.Service.changeState(dto);
  }
  // @Get('search-by-field')
  // async searchByField(@Body() searchDto: SearchEngineDto): Promise<ReturnDto> {
  //   return await this.Service.searchByField(searchDto);
  // }
}