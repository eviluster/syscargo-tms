import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Province } from './entities/province.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchProvinceDto } from './dto/search-province.dto';
import { ReturnDto } from 'src/common/base/dto';

@Injectable()
export class ProvinceService extends BaseServiceCRUD<Province,CreateProvinceDto,UpdateProvinceDto> {
  constructor(
    @InjectRepository(Province)
    private readonly repository: Repository<Province>,
  ) {
    super(repository)
  }
  async searchByField(searchDto: SearchProvinceDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();

      const queryBuilder = this.repository.createQueryBuilder('province');
       if(searchDto.name != undefined && 
          searchDto.name != null )
      {
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')
        { 
          queryBuilder.andWhere(`province.name  LIKE :name`, { name: `%${searchDto.name}%` });
        }
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')

        {
          queryBuilder.andWhere(`province.name LIKE :name`, { name: `%${searchDto.name}%` });
        }
      }
      if(searchDto.description)
      {
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        { 
          queryBuilder.andWhere(`province.description LIKE :description`, { description: `%${searchDto.description}%` });
        }
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        {
          queryBuilder.andWhere(`province.description LIKE :description`, { description: `%${searchDto.description}%` });
        }
      }
      if(searchDto.country)
      {
        if(searchDto.country!= undefined &&
          searchDto.country != null &&
          searchDto.country && searchDto.country.trim() !== '')
        { 
          queryBuilder.andWhere(`province.country.id = :province`, { province: searchDto.country });
        }
      }
      // if(searchDto.isCapital!= undefined &&
      //   searchDto.isCapital != null )
      // { 
      //   queryBuilder.andWhere(`province.isCapital = :isCapital`, { isCapital: searchDto.isCapital });
      // }
      
      returnDto.data = await queryBuilder.getMany();
  
    return returnDto;
  }
}
