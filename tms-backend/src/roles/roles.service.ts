import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {  }
  async findAll() {
    return await this.repository.find();
  }
}
