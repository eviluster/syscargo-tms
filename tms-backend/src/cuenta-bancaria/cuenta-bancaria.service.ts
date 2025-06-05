import { Injectable } from '@nestjs/common';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { UpdateCuentaBancariaDto } from './dto/update-cuenta-bancaria.dto';
import { ReturnDto } from 'src/common/base/dto/return.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';
import { SearchCuentaBancariaDto } from './dto/search-cuenta-bancaria.dto';

@Injectable()
export class CuentaBancariaService extends BaseServiceCRUD<
CuentaBancaria,
CreateCuentaBancariaDto,
UpdateCuentaBancariaDto
> {
  constructor(
    @InjectRepository(CuentaBancaria)
    private readonly repository: Repository<CuentaBancaria>,
  ) {
    super(repository)
  }

  async searchByField(searchDto: SearchCuentaBancariaDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();

      const queryBuilder = this.repository.createQueryBuilder('cuenta_bancaria');
       if(searchDto.id != undefined && 
          searchDto.id != null )
        { 
          queryBuilder.andWhere(`cuenta_bancaria.id '  =  :id`, { id: `${searchDto.id}` });
        }
        if(searchDto.beneficiario != undefined && 
          searchDto.beneficiario != null && 
          searchDto.beneficiario && searchDto.beneficiario.trim() !== '')
        {
          queryBuilder.andWhere(`cuenta_bancaria.beneficiario LIKE :beneficiario`, { beneficiario: `%${searchDto.beneficiario}%` });
        }
        if(searchDto.nombreBanco != undefined && 
          searchDto.nombreBanco != null && 
          searchDto.nombreBanco && searchDto.nombreBanco.trim() !== '')
        {
          queryBuilder.andWhere(`cuenta_bancaria.nombreBanco LIKE :nombreBanco`, { nombreBanco: `%${searchDto.nombreBanco}%` });
        }
        if(searchDto.direccionBanco != undefined && 
          searchDto.direccionBanco != null && 
          searchDto.direccionBanco && searchDto.direccionBanco.trim() !== '')
        {
          queryBuilder.andWhere(`cuenta_bancaria.direccionBanco LIKE :direccionBanco`, { direccionBanco: `%${searchDto.direccionBanco}%` });
        }
        if(searchDto.codigo != undefined && 
          searchDto.codigo != null && 
          searchDto.codigo && searchDto.codigo.trim() !== '')
        {
          queryBuilder.andWhere(`cuenta_bancaria.codigo LIKE :codigo`, { codigo: `%${searchDto.codigo}%` });
        }
        if(searchDto.currency != undefined && 
          searchDto.currency != null && 
          searchDto.currency && searchDto.currency.trim() !== '')
        {
          queryBuilder.andWhere(`cuenta_bancaria.currency LIKE :currency`, { currency: `%${searchDto.currency}%` });
        }
        if(searchDto.numeroCuenta != undefined && 
          searchDto.numeroCuenta != null && 
          searchDto.numeroCuenta && searchDto.numeroCuenta.trim() !== '')
        {
          queryBuilder.andWhere(`cuenta_bancaria.numeroCuenta LIKE :numeroCuenta`, { numeroCuenta: `%${searchDto.numeroCuenta}%` });
        }
        if(searchDto.direccionBeneficiario != undefined && 
          searchDto.direccionBeneficiario != null && 
          searchDto.direccionBeneficiario && searchDto.direccionBeneficiario.trim() !== '')
        {
          queryBuilder.andWhere(`cuenta_bancaria.direccionBeneficiario LIKE :direccionBeneficiario`, { direccionBeneficiario: `%${searchDto.direccionBeneficiario}%` });
        }
      returnDto.data = await queryBuilder.getMany();
  
    return returnDto;
  }
}
 