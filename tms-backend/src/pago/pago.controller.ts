import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';
import { ReturnDto } from 'src/common/base/dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';

@Controller('pago')
export class PagoController extends BaseControllerCRUD<
CreatePagoDto,
UpdatePagoDto,
PagoService
> {
  constructor(private readonly Service: PagoService) {
    super(Service);
  }
 
@Get('by-id')
async getByDeleteDto(@Body() dto: DeleteDto): Promise<ReturnDto> {
  return this.Service.getByID(dto);
}
}