import { Injectable } from '@nestjs/common';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Municipality } from './entities/municipality.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchMunicipalityDto } from './dto/search-municipality.dto';
import { ReturnDto } from 'src/common/base/dto';

@Injectable()
export class MunicipalityService extends BaseServiceCRUD<Municipality,CreateMunicipalityDto,UpdateMunicipalityDto> {
  constructor(
    @InjectRepository(Municipality)
    private readonly repository: Repository<Municipality>,
  ) {
    super(repository)
  }
  async searchByField(searchDto: SearchMunicipalityDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();

      const queryBuilder = this.repository.createQueryBuilder('municipality');
       if(searchDto.name != undefined && 
          searchDto.name != null )
      {
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')
        { 
          queryBuilder.andWhere(`municipality.name  LIKE :name`, { name: `%${searchDto.name}%` });
        }
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')

        {
          queryBuilder.andWhere(`municipality.name LIKE :name`, { name: `%${searchDto.name}%` });
        }
      }
      if(searchDto.description)
      {
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        { 
          queryBuilder.andWhere(`municipality.description LIKE :description`, { description: `%${searchDto.description}%` });
        }
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        {
          queryBuilder.andWhere(`municipality.description LIKE :description`, { description: `%${searchDto.description}%` });
        }
      }
      if(searchDto.province)
      {
        if(searchDto.province!= undefined &&
          searchDto.province != null &&
          searchDto.province && searchDto.province.trim() !== '')
        { 
          queryBuilder.andWhere(`municipality.province.id = :province`, { province: searchDto.province });
        }
      }
      returnDto.data = await queryBuilder.getMany();
  
    return returnDto;
  }
}
