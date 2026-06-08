import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { ReturnDto } from 'src/common/base/dto';
import { Prestatarioserv } from './entities/prestatarioserv.entity';
import { CreatePrestatarioservDto, UpdatePrestatarioservDto } from './dto';
import { DeleteDto } from 'src/common/base/dto/delete.dto';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { Servicio } from 'src/servicio/entities/servicio.entity';

@Injectable()
export class PrestatarioservService extends BaseServiceCRUD<
  Prestatarioserv,
  CreatePrestatarioservDto,
  UpdatePrestatarioservDto
> {
  constructor(
    @InjectRepository(Prestatarioserv)
    private readonly repository: Repository<Prestatarioserv>,
    @InjectRepository(Prestatario)
    private readonly prestatarioRepository: Repository<Prestatario>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {
    super(repository);
  }

  async create(createDto: CreatePrestatarioservDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    
    // Validar que el precio sea > 0
    if (createDto.precio <= 0) {
      throw new BadRequestException(
        'El precio del servicio debe ser mayor a 0',
      );
    }

    // Validar que el prestatario existe
    const prestatario = await this.prestatarioRepository.findOne({
      where: { id: createDto.prestatario },
    });

    if (!prestatario) {
      throw new NotFoundException('Prestatario no encontrado');
    }

    // Validar que el servicio existe
    const servicio = await this.servicioRepository.findOne({
      where: { id: createDto.servicio },
    });

    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }

    // Crear entidad
    const prestatarioServ = this.repository.create({
      prestatario,
      servicio,
      precio: createDto.precio,
      descripcion: createDto.descripcion,
      isActive: true,
    });

    try {
      returnDto.data = await this.repository.save(prestatarioServ);
      returnDto.isSuccess = true;
    } catch (error) {
      returnDto.isSuccess = false;
      throw error;
    }

    return returnDto;
  }

  async update(updateDto: UpdatePrestatarioservDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    
    // Validar que existe
    const prestatarioServ = await this.repository.findOne({
      where: { id: updateDto.id },
    });

    if (!prestatarioServ) {
      throw new NotFoundException('Registro no encontrado');
    }

    // Validar precio si se intenta actualizar
    if (updateDto.precio !== undefined && updateDto.precio <= 0) {
      throw new BadRequestException(
        'El precio del servicio debe ser mayor a 0',
      );
    }

    // Actualizar solo los campos proporcionados
    const fields: (keyof UpdatePrestatarioservDto)[] = [
      'precio',
      'descripcion',
    ];

    for (const field of fields) {
      if (
        updateDto[field] !== undefined &&
        Object.prototype.hasOwnProperty.call(updateDto, field)
      ) {
        (prestatarioServ as any)[field] = (updateDto as any)[field];
      }
    }

    try {
      returnDto.data = await this.repository.save(prestatarioServ);
      returnDto.isSuccess = true;
    } catch (error) {
      returnDto.isSuccess = false;
      throw error;
    }

    return returnDto;
  }

  async remove(deleteDto: DeleteDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    
    const prestatarioServ = await this.repository.findOne({
      where: { id: deleteDto.id },
    });

    if (!prestatarioServ) {
      throw new NotFoundException('Registro no encontrado');
    }

    prestatarioServ.isActive = false;
    try {
      returnDto.data = await this.repository.save(prestatarioServ);
      returnDto.isSuccess = true;
    } catch (error) {
      returnDto.isSuccess = false;
      throw error;
    }

    return returnDto;
  }

  async active(deleteDto: DeleteDto): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    
    const prestatarioServ = await this.repository.findOne({
      where: { id: deleteDto.id },
    });

    if (!prestatarioServ) {
      throw new NotFoundException('Registro no encontrado');
    }

    prestatarioServ.isActive = true;
    try {
      returnDto.data = await this.repository.save(prestatarioServ);
      returnDto.isSuccess = true;
    } catch (error) {
      returnDto.isSuccess = false;
      throw error;
    }

    return returnDto;
  }

  /**
   * Obtener todos los servicios activos de un prestatario
   */
  async findByPrestatario(prestatarioId: string): Promise<Prestatarioserv[]> {
    return this.repository.find({
      where: {
        prestatario: { id: prestatarioId },
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Calcular precio total: suma todos los servicios solicitados + 5% comisión
   * Input: array de IDs de PrestatarioServ
   * Output: { subtotal, comision (5%), total }
   */
  async calculateTotalPrice(serviciosIds: string[]): Promise<{
    servicios: Array<{ id: string; precio: number; descripcion?: string }>;
    subtotal: number;
    comision_porcentaje: number;
    comision_monto: number;
    total: number;
  }> {
    if (!serviciosIds || serviciosIds.length === 0) {
      throw new BadRequestException('Se requiere al menos un servicio');
    }

    // Obtener todos los servicios
    const servicios = await this.repository.find({
      where: {
        id: serviciosIds as any,
        isActive: true,
      },
    });

    if (servicios.length === 0) {
      throw new NotFoundException('Servicios no encontrados');
    }

    // Calcular subtotal
    const subtotal = servicios.reduce((sum, s) => sum + Number(s.precio), 0);

    // Aplicar comisión del 5%
    const comision_porcentaje = 5;
    const comision_monto = Number((subtotal * (comision_porcentaje / 100)).toFixed(2));
    const total = Number((subtotal + comision_monto).toFixed(2));

    return {
      servicios: servicios.map((s) => ({
        id: s.id,
        precio: Number(s.precio),
        descripcion: s.descripcion,
      })),
      subtotal: Number(subtotal.toFixed(2)),
      comision_porcentaje,
      comision_monto,
      total,
    };
  }

  override async findAllItems() {
    return super.findAllItems();
  }
}