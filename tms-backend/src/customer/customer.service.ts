import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService  extends BaseServiceCRUD<
Customer,
CreateCustomerDto,
UpdateCustomerDto> {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {
    super(repository)
  }

}
