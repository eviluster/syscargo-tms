import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoServicioMecanico } from './entities/tipo-servicio-mecanico.entity';
import { CreateTipoServicioMecanicoDto, UpdateTipoServicioMecanicoDto } from './dto/tipo-servicio-mecanico.dto';

@Injectable()
export class TipoServicioMecanicoService {
  constructor(
    @InjectRepository(TipoServicioMecanico)
    private readonly tipoServicioRepository: Repository<TipoServicioMecanico>,
  ) {}

  async create(createDto: CreateTipoServicioMecanicoDto): Promise<TipoServicioMecanico> {
    // Verificar que el código no exista
    const existing = await this.tipoServicioRepository.findOne({
      where: { codigo: createDto.codigo },
    });

    if (existing) {
      throw new BadRequestException(`Ya existe un tipo de servicio con código ${createDto.codigo}`);
    }

    const tipoServicio = this.tipoServicioRepository.create(createDto);
    return this.tipoServicioRepository.save(tipoServicio);
  }

  async findAll(): Promise<TipoServicioMecanico[]> {
    return this.tipoServicioRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TipoServicioMecanico> {
    const tipoServicio = await this.tipoServicioRepository.findOne({
      where: { id },
    });

    if (!tipoServicio) {
      throw new NotFoundException(`Tipo de servicio con ID ${id} no encontrado`);
    }

    return tipoServicio;
  }

  async update(id: string, updateDto: UpdateTipoServicioMecanicoDto): Promise<TipoServicioMecanico> {
    const tipoServicio = await this.findOne(id);

    Object.assign(tipoServicio, updateDto);
    return this.tipoServicioRepository.save(tipoServicio);
  }

  async remove(id: string): Promise<void> {
    const tipoServicio = await this.findOne(id);
    await this.tipoServicioRepository.remove(tipoServicio);
  }

  async findByCodigo(codigo: string): Promise<TipoServicioMecanico | null> {
    return this.tipoServicioRepository.findOne({
      where: { codigo },
    });
  }
}