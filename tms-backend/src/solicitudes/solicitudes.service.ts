import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud, SolicitudStatus } from './solicitudes.entity';
import { CreateSolicitudDto } from './dto/create-solicitudes.dto';
import { UpdateSolicitudDto } from './dto/update-solicitudes.dto';

import { Client } from 'src/cliente/entities/cliente.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudesRepo: Repository<Solicitud>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,

    @InjectRepository(Prestatario)
    private readonly prestatarioRepo: Repository<Prestatario>,
  ) {}

  /* ========================= CREATE ========================= */

  async create(dto: CreateSolicitudDto): Promise<Solicitud> {
    const solicitud = this.solicitudesRepo.create({
      ...dto,
      servicios: dto.servicios ?? [],
      status: SolicitudStatus.PENDING,
      serviceRequested: dto.serviceRequested,
      created_by_prestatario_id: dto.createdByPrestatarioId ?? null,
    });

    // cliente
    if (dto.cliente_id) {
      const client = await this.clientRepo.findOne({
        where: { id: dto.cliente_id },
      });
      if (client) {
        solicitud.cliente = client;
      }
    }

    // prestatario asignado
    if (dto.assigned_prestatario_id) {
      const p = await this.prestatarioRepo.findOne({
        where: { id: dto.assigned_prestatario_id },
      });
      if (p) {
        solicitud.assignedPrestatario = p;
      }
    }

    // prestatario creador
    if (dto.createdByPrestatarioId) {
      const cp = await this.prestatarioRepo.findOne({
        where: { id: dto.createdByPrestatarioId },
      });
      if (cp) {
        solicitud.createdByPrestatario = cp;
      }
    }

    return this.solicitudesRepo.save(solicitud);
  }

  /* ========================= FIND ALL ========================= */

  async findAll(filters?: {
    cliente_id?: string;
    serviceRequested?: string;
    createdByPrestatarioId?: string;
  }): Promise<Solicitud[]> {
    const qb = this.solicitudesRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.cliente', 'cliente')
      .leftJoinAndSelect('s.assignedPrestatario', 'assignedPrestatario')
      .leftJoinAndSelect('s.createdByPrestatario', 'createdByPrestatario')
      .orderBy('s.created_at', 'DESC');

    if (filters?.cliente_id) {
      qb.andWhere('s.cliente_id = :cliente_id', {
        cliente_id: filters.cliente_id,
      });
    }

    if (filters?.serviceRequested) {
      qb.andWhere('s.serviceRequested = :serviceRequested', {
        serviceRequested: filters.serviceRequested,
      });
    }

    if (filters?.createdByPrestatarioId) {
      qb.andWhere('s.created_by_prestatario_id = :createdByPrestatarioId', {
        createdByPrestatarioId: filters.createdByPrestatarioId,
      });
    }

    return qb.getMany();
  }

  /* ========================= FIND ONE ========================= */

  async findOne(id: string): Promise<Solicitud> {
    const s = await this.solicitudesRepo.findOne({
      where: { id },
      relations: ['cliente', 'assignedPrestatario', 'createdByPrestatario'],
    });

    if (!s) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return s;
  }

  /* ========================= UPDATE ========================= */

  async update(id: string, dto: UpdateSolicitudDto): Promise<Solicitud> {
    const s = await this.findOne(id);

    Object.assign(s, dto);

    if (dto.cliente_id) {
      const client = await this.clientRepo.findOne({
        where: { id: dto.cliente_id },
      });
      if (client) s.cliente = client;
    }

    if (dto.assigned_prestatario_id) {
      const p = await this.prestatarioRepo.findOne({
        where: { id: dto.assigned_prestatario_id },
      });
      if (p) s.assignedPrestatario = p;
    }

    if ((dto as any).createdByPrestatarioId) {
      const cp = await this.prestatarioRepo.findOne({
        where: { id: (dto as any).createdByPrestatarioId },
      });
      if (cp) s.createdByPrestatario = cp;
    }

    return this.solicitudesRepo.save(s);
  }

  /* ========================= DELETE ========================= */

  async remove(id: string): Promise<void> {
    const s = await this.findOne(id);
    await this.solicitudesRepo.remove(s);
  }

  /* ========================= STATUS ========================= */

  async changeStatus(id: string, status: SolicitudStatus): Promise<Solicitud> {
    const s = await this.findOne(id);
    s.status = status;
    return this.solicitudesRepo.save(s);
  }

  /* ========================= BY CLIENTE ========================= */

  async findByCliente(clienteId: string): Promise<Solicitud[]> {
    return this.solicitudesRepo.find({
      where: { cliente_id: clienteId },
      relations: ['cliente', 'assignedPrestatario', 'createdByPrestatario'],
      order: { created_at: 'DESC' },
    });
  }
}
