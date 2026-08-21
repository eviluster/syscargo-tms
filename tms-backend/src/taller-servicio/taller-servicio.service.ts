import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TallerServicio } from './entities/taller-servicio.entity';
import { CreateTallerServicioDto, UpdateTallerServicioDto } from './dto/taller-servicio.dto';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

@Injectable()
export class TallerServicioService {
  constructor(
    @InjectRepository(TallerServicio)
    private readonly tallerServicioRepository: Repository<TallerServicio>,
    @InjectRepository(Prestatario)
    private readonly prestatarioRepository: Repository<Prestatario>,
  ) {}

  async create(createDto: CreateTallerServicioDto): Promise<TallerServicio> {
    // Verificar que el prestatario existe y es taller
    const prestatario = await this.prestatarioRepository.findOne({
      where: { id: createDto.prestatarioId },
    });

    if (!prestatario) {
      throw new NotFoundException(`Prestatario con ID ${createDto.prestatarioId} no encontrado`);
    }

    if (!prestatario.es_taller) {
      throw new BadRequestException('El prestatario no está configurado como taller');
    }

    const servicio = this.tallerServicioRepository.create({
      ...createDto,
      prestatario,
    });

    return this.tallerServicioRepository.save(servicio);
  }

  async findAll(prestatarioId?: number | string): Promise<TallerServicio[]> {
    const queryBuilder = this.tallerServicioRepository
      .createQueryBuilder('servicio')
      .leftJoinAndSelect('servicio.prestatario', 'prestatario')
      .where('servicio.activo = :activo', { activo: true });

    if (prestatarioId) {
      queryBuilder.andWhere('servicio.prestatario_id = :prestatarioId', { prestatarioId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<TallerServicio> {
    const servicio = await this.tallerServicioRepository.findOne({
      where: { id },
      relations: ['prestatario'],
    });

    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    return servicio;
  }

  async update(id: string, updateDto: UpdateTallerServicioDto): Promise<TallerServicio> {
    const servicio = await this.findOne(id);

    Object.assign(servicio, updateDto);
    return this.tallerServicioRepository.save(servicio);
  }

  async remove(id: string): Promise<void> {
    const servicio = await this.findOne(id);
    await this.tallerServicioRepository.remove(servicio);
  }

  async findByPrestatario(prestatarioId: string): Promise<TallerServicio[]> {
    return this.tallerServicioRepository.find({
      where: { prestatario: { id: prestatarioId } },
      relations: ['prestatario'],
    });
  }
}