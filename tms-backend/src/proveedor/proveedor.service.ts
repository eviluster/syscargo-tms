import { Injectable } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Proveedor } from './entities/proveedor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnDto } from 'src/common/base/dto';
import { SearchProveedorDto } from './dto/search-proveedor.dto';

@Injectable()
export class ProveedorService extends BaseServiceCRUD<Proveedor,CreateProveedorDto,UpdateProveedorDto> {
  constructor(
    @InjectRepository(Proveedor)
    private readonly repository: Repository<Proveedor>,
  ) {
    super(repository)
  }
  async searchByField(searchDto: SearchProveedorDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();

      const queryBuilder = this.repository.createQueryBuilder('proveedor');
       if(searchDto.name != undefined && 
          searchDto.name != null )
      {
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')
        { 
          queryBuilder.andWhere(`proveedor.name  LIKE :name`, { name: `%${searchDto.name}%` });
        }
        if(searchDto.name != undefined && 
          searchDto.name != null && 
          searchDto.name && searchDto.name.trim() !== '')
        {
          queryBuilder.andWhere(`proveedor.name LIKE :name`, { name: `%${searchDto.name}%` });
        }
      }
      if(searchDto.description)
      {
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        { 
          queryBuilder.andWhere(`proveedor.description LIKE :description`, { description: `%${searchDto.description}%` });
        }
        if(searchDto.description != undefined &&
          searchDto.description != null &&
          searchDto.description && searchDto.description.trim() !== '')
        {
          queryBuilder.andWhere(`proveedor.description->>'en' LIKE :description`, { description: `%${searchDto.description}%` });
        }
      }
      returnDto.data = await queryBuilder.getMany();
  
    return returnDto;
  }
}
