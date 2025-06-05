import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from '../common/base/class/base.service.crud.class';
import { Um } from './entities/um.entity';
import { CreateUmDto } from './dto/create-um.dto';
import { UpdateUmDto } from './dto/update-um.dto';
import { ReturnDto } from 'src/common/base/dto';
import { SearchUmDto } from './dto/search-um.dto';

@Injectable()
export class UmService extends BaseServiceCRUD<Um,CreateUmDto,UpdateUmDto> {
  constructor(
    @InjectRepository(Um)
    private readonly repository: Repository<Um>,
  ) {
    super(repository)
  }
  async searchByField(searchDto: SearchUmDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();

      const queryBuilder = this.repository.createQueryBuilder('um');
       if(searchDto.name != undefined && 
          searchDto.name != null )
      {
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')
        { 
          queryBuilder.andWhere(`um.name  LIKE :name`, { name: `%${searchDto.name}%` });
        }
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')

        {
          queryBuilder.andWhere(`um.name LIKE :name`, { name: `%${searchDto.name}%` });
        }
      }
      if(searchDto.description)
      {
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        { 
          queryBuilder.andWhere(`um.description LIKE :description`, { description: `%${searchDto.description}%` });
        }
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        {
          queryBuilder.andWhere(`um.description  LIKE :description`, { description: `%${searchDto.description}%` });
        }
      }
      returnDto.data = await queryBuilder.getMany();
  
    return returnDto;
  }
}
