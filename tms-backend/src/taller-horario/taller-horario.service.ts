import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TallerHorario } from './entities/taller-horario.entity';
import { CreateTallerHorarioDto, UpdateTallerHorarioDto } from './dto/taller-horario.dto';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';

@Injectable()
export class TallerHorarioService {
  constructor(
    @InjectRepository(TallerHorario)
    private readonly tallerHorarioRepository: Repository<TallerHorario>,
    @InjectRepository(Prestatario)
    private readonly prestatarioRepository: Repository<Prestatario>,
  ) {}

  async create(createDto: CreateTallerHorarioDto): Promise<TallerHorario> {
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

    // Verificar si ya existe un horario para ese día
    const existingHorario = await this.tallerHorarioRepository.findOne({
      where: {
        prestatario: { id: createDto.prestatarioId },
        dia_semana: createDto.dia_semana,
      },
    });

    if (existingHorario) {
      throw new BadRequestException(`Ya existe un horario configurado para el día ${createDto.dia_semana}`);
    }

    const horario = this.tallerHorarioRepository.create({
      ...createDto,
      prestatario,
    });

    return this.tallerHorarioRepository.save(horario);
  }

  async findAll(prestatarioId?: string): Promise<TallerHorario[]> {
    const queryBuilder = this.tallerHorarioRepository
      .createQueryBuilder('horario')
      .leftJoinAndSelect('horario.prestatario', 'prestatario')
      .orderBy('horario.dia_semana', 'ASC');

    if (prestatarioId) {
      queryBuilder.andWhere('horario.prestatario_id = :prestatarioId', { prestatarioId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<TallerHorario> {
    const horario = await this.tallerHorarioRepository.findOne({
      where: { id },
      relations: ['prestatario'],
    });

    if (!horario) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    return horario;
  }

  async update(id: string, updateDto: UpdateTallerHorarioDto): Promise<TallerHorario> {
    const horario = await this.findOne(id);

    Object.assign(horario, updateDto);
    return this.tallerHorarioRepository.save(horario);
  }

  async remove(id: string): Promise<void> {
    const horario = await this.findOne(id);
    await this.tallerHorarioRepository.remove(horario);
  }

  async findByPrestatario(prestatarioId: string): Promise<TallerHorario[]> {
    return this.tallerHorarioRepository.find({
      where: { prestatario: { id: prestatarioId } },
      order: { dia_semana: 'ASC' },
      relations: ['prestatario'],
    });
  }

  async findByDiaSemana(prestatarioId: string, diaSemana: number): Promise<TallerHorario | null> {
    return this.tallerHorarioRepository.findOne({
      where: {
        prestatario: { id: prestatarioId },
        dia_semana: diaSemana,
        activo: true,
      },
    });
  }
}