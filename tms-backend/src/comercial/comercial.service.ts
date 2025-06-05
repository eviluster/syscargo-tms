import { Injectable } from '@nestjs/common';
import { CreateComercialDto } from './dto/create-comercial.dto';
import { UpdateComercialDto } from './dto/update-comercial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Comercial } from './entities/comercial.entity';
import { Repository } from 'typeorm';
import { ReturnDto } from 'src/common/base/dto';
import { SearchComercialDto } from './dto/search-comercial.dto';

@Injectable()
export class ComercialService extends BaseServiceCRUD<
Comercial,
CreateComercialDto,
UpdateComercialDto> {
  constructor(
    @InjectRepository(Comercial)
    private readonly repository: Repository<Comercial>,
  ) {
    super(repository)
  }
  async searchByField(searchDto: SearchComercialDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();

      const queryBuilder = this.repository.createQueryBuilder('comercial');
       if(searchDto.name != undefined && 
          searchDto.name != null )
      {
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')
        { 
          queryBuilder.andWhere(`comercial.name  LIKE :name`, { name: `%${searchDto.name}%` });
        }
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')
        {
          queryBuilder.andWhere(`comercial.name LIKE :name`, { name: `%${searchDto.name}%` });
        }
      }
      returnDto.data = await queryBuilder.getMany();
  
    return returnDto;
  }
}
