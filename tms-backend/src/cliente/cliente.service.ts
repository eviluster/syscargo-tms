// src/clients/client.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/cliente.entity';
import { CreateClientDto } from './dto/create-cliente.dto';
import { UpdateClientDto } from './dto/update-cliente.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Client> {
    const c = await this.clientRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Client ${id} no encontrado`);
    return c;
  }

  async findByUserId(userId: string): Promise<Client | null> {
    const c = await this.clientRepo.findOne({
      where: { user: { id: userId } },
    });
    return c ?? null;
  }

  /**
   * create: usado por Admin para crear un Client vinculado a un user existente
   * si userId no está presente lanza BadRequestException
   */
  async create(dto: CreateClientDto, userId?: string): Promise<Client> {
    if (!userId) {
      throw new BadRequestException(
        'userId es requerido para create() por admin',
      );
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User asociado no encontrado');

    // evitar duplicados: si ya existe client para ese user, devolver o lanzar error
    const existing = await this.findByUserId(userId);
    if (existing) {
      throw new BadRequestException('El usuario ya tiene un perfil Client');
    }

    const c = new Client();
    c.user = user;
    c.company = dto.company;
    c.contact_name = dto.contact_name;
    c.contact_phone = dto.contact_phone;
    c.tax_id = dto.tax_id;
    c.address = dto.address;
    c.modalidad = dto.modalidad;

    return this.clientRepo.save(c);
  }

  /**
   * createFromUser: usado por el propio usuario autenticado para crear su perfil
   */
  async createFromUser(dto: CreateClientDto, user: User): Promise<Client> {
    // verificar si ya existe
    const existing = await this.findByUserId(user.id);
    if (existing) {
      throw new BadRequestException('El usuario ya tiene un perfil Client');
    }
    console.log('Este es el USER del cliente', user);
    console.log('Este es el DTO del cliente', dto);

    const c = new Client();
    c.user = user;
    c.company = dto.company;
    c.contact_name = dto.contact_name;
    c.contact_phone = dto.contact_phone;
    c.tax_id = dto.tax_id;
    c.address = dto.address;
    c.modalidad = dto.modalidad;

    console.log('Este es el cliente que se va a crear', c);

    return this.clientRepo.save(c);
  }

  /**
   * update: admin o el propio owner pueden actualizar
   */
  async update(id: string, dto: UpdateClientDto, actor: User): Promise<Client> {
    const c = await this.findOne(id);
    console.log('c', c);
    const isOwner = c.user?.id === actor.id;
    const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
    if (!isOwner && !isAdmin) throw new ForbiddenException('No autorizado');

    c.company = dto.company ?? c.company;
    c.contact_name = dto.contact_name ?? c.contact_name;
    c.contact_phone = dto.contact_phone ?? c.contact_phone;
    c.tax_id = dto.tax_id ?? c.tax_id;
    c.address = dto.address ?? c.address;

    return this.clientRepo.save(c);
  }

  /**
   * remove: admin o owner pueden eliminar
   */
  async remove(id: string, actor: User): Promise<void> {
    const c = await this.findOne(id);
    const isOwner = c.user?.id === actor.id;
    const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
    if (!isOwner && !isAdmin) throw new ForbiddenException('No autorizado');

    await this.clientRepo.remove(c);
  }
}
