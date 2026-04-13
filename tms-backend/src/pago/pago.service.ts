import { Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Pago } from './entities/pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnDto } from 'src/common/base/dto';
import { Configuracion } from 'src/configuracion/entities/configuracion.entity';
import { DeleteDto } from 'src/common/base/dto/delete.dto';
import { CodeEnum } from 'src/common/enum/code.enum';

@Injectable()
export class PagoService   extends BaseServiceCRUD<
Pago,
CreatePagoDto,
UpdatePagoDto> {
  constructor(
    @InjectRepository(Pago)
    private readonly repository: Repository<Pago>,
    @InjectRepository(Configuracion)
    private readonly repositoryConfiguracion: Repository<Configuracion>,
  ) {
    super(repository)
  }

  async getConfigPago(): Promise<Configuracion> {
    const config = await this.repositoryConfiguracion.findOne({ where: { id: 'configPago' } });
    return config;
  }
  override async create(createDto:CreatePagoDto): Promise<ReturnDto> {

    // 1 obtener el config % de pago para inicio prod
    const config = await this.getConfigPago();

    // obtengo la reserva para saber si tiene mas pagos y cto es el tota
    

    const entity = super.create(createDto);
    return entity;
  }

  async getByID(deleteDto: DeleteDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    const entity = await this.repository.findOne({  
      where: {
        id: deleteDto.id,
      },
    });
    if (!entity) {
      returnDto.isSuccess = false;
      returnDto.returnCode = CodeEnum.BAD_REQUEST;
      returnDto.errorMessage =  `the Item with id ${deleteDto.id} do not exist` 
    } else {
      returnDto.data = entity;
    }
    return returnDto;
  } 

}
