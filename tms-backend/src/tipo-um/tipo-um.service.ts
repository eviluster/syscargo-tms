import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoUm } from './entities/tipo-um.entity';
import { BaseServiceCRUD } from '../common/base/class/base.service.crud.class';
import { Injectable } from '@nestjs/common';
import { CreateTipoUmDto } from './dto/create-tipo-um.dto';
import { UpdateTipoUmDto } from './dto/update-tipo-um.dto';
import { ReturnDto } from 'src/common/base/dto';
import { SearchTipoUnidadMedidaDto } from './dto/search-tipo-unidad-medida.dto';

@Injectable()
export class TipoUmService extends BaseServiceCRUD<TipoUm,CreateTipoUmDto,UpdateTipoUmDto> {
  constructor(
    @InjectRepository(TipoUm)
    private readonly repository: Repository<TipoUm>,
  ) {
    super(repository)
  }
  async searchByField(searchDto: SearchTipoUnidadMedidaDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();

      const queryBuilder = this.repository.createQueryBuilder('tipo-unidad-medida');
       if(searchDto.name != undefined && 
          searchDto.name != null )
      {
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')
        { 
          queryBuilder.andWhere(`tipo-unidad-medida.name  LIKE :name`, { name: `%${searchDto.name}%` });
        }
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')

        {
          queryBuilder.andWhere(`tipo-unidad-medida.name LIKE :name`, { name: `%${searchDto.name}%` });
        }
      }
      if(searchDto.description)
      {
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        { 
          queryBuilder.andWhere(`tipo-unidad-medida.description LIKE :description`, { description: `%${searchDto.description}%` });
        }
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        {
          queryBuilder.andWhere(`tipo-unidad-medida.description LIKE :description`, { description: `%${searchDto.description}%` });
        }
      }
      returnDto.data = await queryBuilder.getMany();
  
    return returnDto;
  }
}
