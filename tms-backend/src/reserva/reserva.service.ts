import { Injectable } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Reserva } from './entities/reserva.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeStateDto } from './dto/change-stete.dto';
import { ReturnDto } from 'src/common/base/dto';
import { StateEnum } from './enum/state.enum';
import { ProducidoReservaDto } from './dto/producido-reserva.dto';
import { EmbarcadoReservaDto } from './dto/embarcado-reserva.dto';

@Injectable()
export class ReservaService extends BaseServiceCRUD<
Reserva,
CreateReservaDto,
UpdateReservaDto> {
  constructor(
    @InjectRepository(Reserva)
    private readonly repository: Repository<Reserva>,
  ) {
    super(repository)
  }

  async changeState(dto: ChangeStateDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    const reserva = await this.repository.findOne(
      { 
        where: { id: dto.id },
      }
    );
    if (reserva) {
      reserva.state = dto.state;
      await this.repository.save(reserva);
      returnDto.data = reserva;
    }
    return returnDto;
  }

  async producido(dto: ProducidoReservaDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    const reserva = await this.repository.findOne(
      { 
        where: { id: dto.id },
      }
    );
    if (reserva) {
      reserva.state = StateEnum.Producido;
      reserva.vin = dto.vin;
      reserva.motor = dto.motor;
      await this.repository.save(reserva);
      returnDto.data = reserva;
    }
    return returnDto;
  }   

  async embarcado(dto: EmbarcadoReservaDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    const reserva = await this.repository.findOne(
      { 
        where: { id: dto.id },
      }
    );
    if (reserva) {
      reserva.state = StateEnum.Embarcado;
      reserva.bl = dto.bl;
      reserva.contenedor = dto.contenedor;
      await this.repository.save(reserva);
      returnDto.data = reserva;
    }
    return returnDto;
  }   

  // async searchByField(searchDto: SearchEngineDto): Promise<ReturnDto> {
  //   const returnDto = new ReturnDto();

  //     const queryBuilder = this.repository.createQueryBuilder('engine');
  //      if(searchDto.name != undefined && 
  //         searchDto.name != null )
  //     {
  //       if(searchDto.name.es != undefined && 
  //         searchDto.name.es != null && 
  //         searchDto.name.es && searchDto.name.es.trim() !== '')
  //       { 
  //         queryBuilder.andWhere(`engine.name  LIKE :name`, { name: `%${searchDto.name.es}%` });
  //       }
  //       if(searchDto.name.en != undefined && 
  //         searchDto.name.en != null && 
  //         searchDto.name.en && searchDto.name.en.trim() !== '')

  //       {
  //         queryBuilder.andWhere(`engine.name->>'en' LIKE :name`, { name: `%${searchDto.name.en}%` });
  //       }
  //     }
  //     if(searchDto.description)
  //     {
  //       if(searchDto.description.es != undefined &&
  //         searchDto.description.es != null &&
  //         searchDto.description.es && searchDto.description.es.trim() !== '')
  //       { 
  //         queryBuilder.andWhere(`engine.description LIKE :description`, { description: `%${searchDto.description.es}%` });
  //       }
  //       if(searchDto.description.en != undefined &&
  //         searchDto.description.en != null &&
  //         searchDto.description.en && searchDto.description.en.trim() !== '')
  //       {
  //         queryBuilder.andWhere(`engine.description->>'en' LIKE :description`, { description: `%${searchDto.description.en}%` });
  //       }
  //     }
  //     returnDto.data = await queryBuilder.getMany();
  
  //   return returnDto;
  // }
}
