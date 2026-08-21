import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CitaTaller, EstadoCita } from './entities/cita-taller.entity';
import {
  CreateCitaTallerDto,
  CreateCitaEscatolinaDto,
  ResponderCitaDto,
  ActualizarEstadoCitaDto,
  ConsultaDisponibilidadCitasDto,
} from './dto/cita-taller.dto';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { TallerServicio } from 'src/taller-servicio/entities/taller-servicio.entity';
import { AddressDetail } from 'src/address-details/entities/address-detail.entity';
import { Tipocarga } from 'src/tipocarga/entities/tipocarga.entity';
import { Tipotransporte } from 'src/tipotransporte/entities/tipotransporte.entity';
import { TallerHorario } from 'src/taller-horario/entities/taller-horario.entity';

@Injectable()
export class CitaTallerService {
  constructor(
    @InjectRepository(CitaTaller)
    private readonly citaTallerRepository: Repository<CitaTaller>,
    @InjectRepository(Prestatario)
    private readonly prestatarioRepository: Repository<Prestatario>,
    @InjectRepository(TallerServicio)
    private readonly tallerServicioRepository: Repository<TallerServicio>,
    @InjectRepository(AddressDetail)
    private readonly addressDetailRepository: Repository<AddressDetail>,
    @InjectRepository(Tipocarga)
    private readonly tipocargaRepository: Repository<Tipocarga>,
    @InjectRepository(Tipotransporte)
    private readonly tipotransporteRepository: Repository<Tipotransporte>,
    @InjectRepository(TallerHorario)
    private readonly tallerHorarioRepository: Repository<TallerHorario>,
  ) {}

  async crearCita(createDto: CreateCitaTallerDto, clienteId: string): Promise<CitaTaller> {
    // Verificar que el taller existe y es taller
    const taller = await this.prestatarioRepository.findOne({
      where: { id: createDto.tallerId },
    });

    if (!taller) {
      throw new NotFoundException(`Taller con ID ${createDto.tallerId} no encontrado`);
    }

    if (!taller.es_taller) {
      throw new BadRequestException('El prestatario no está configurado como taller');
    }

    // Verificar que el cliente existe
    const cliente = await this.prestatarioRepository.findOne({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    // Obtener el servicio
    const servicio = await this.tallerServicioRepository.findOne({
      where: { id: createDto.servicioId },
      relations: ['prestatario'],
    });

    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${createDto.servicioId} no encontrado`);
    }

    // Calcular fecha de fin
    const duracionMinutos = createDto.duracion_minutos || servicio.tiempo_estimado_minutos;
    const fechaInicio = new Date(createDto.fecha_hora_inicio);
    const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60000);

    // Verificar disponibilidad del horario
    const diaSemana = fechaInicio.getDay();
    const horarioDisponible = await this.tallerHorarioRepository.findOne({
      where: {
        prestatario: { id: createDto.tallerId },
        dia_semana: diaSemana,
        activo: true,
      },
    });

    if (!horarioDisponible) {
      throw new BadRequestException(`El taller no tiene horario disponible para el día ${diaSemana}`);
    }

    // Verificar si hay citas superpuestas
    const citasSuperpuestas = await this.citaTallerRepository.find({
      where: [
        {
          taller: { id: createDto.tallerId },
          fecha_hora_inicio: Between(fechaInicio, fechaFin),
          estado: Between(EstadoCita.PENDIENTE, EstadoCita.EN_PROGRESO),
        },
        {
          taller: { id: createDto.tallerId },
          fecha_hora_fin: Between(fechaInicio, fechaFin),
          estado: Between(EstadoCita.PENDIENTE, EstadoCita.EN_PROGRESO),
        },
      ],
    });

    if (citasSuperpuestas.length > 0) {
      throw new BadRequestException('Ya existe una cita en ese horario');
    }

    const cita = this.citaTallerRepository.create({
      taller,
      cliente,
      servicio,
      fecha_hora_inicio: fechaInicio,
      fecha_hora_fin: fechaFin,
      estado: EstadoCita.PENDIENTE,
      precio_servicio_base: servicio.precio_base,
      precio_flete_escatolina: 0,
      precio_total: servicio.precio_base,
      notas_adicionales: createDto.notas_adicionales,
    });

    return this.citaTallerRepository.save(cita);
  }

  async crearCitaEscatolina(createDto: CreateCitaEscatolinaDto, clienteId: string): Promise<CitaTaller> {
    // Crear cita base
    const citaBase: CreateCitaTallerDto = {
      tallerId: createDto.tallerId,
      servicioId: createDto.servicioId,
      fecha_hora_inicio: createDto.fecha_hora_inicio,
      duracion_minutos: createDto.duracion_minutos,
      notas_adicionales: createDto.notas_adicionales,
    };

    const cita = await this.crearCita(citaBase, clienteId);

    // Completar datos de escatolina
    const origen = await this.addressDetailRepository.findOne({
      where: { id: createDto.origenId },
    });

    if (!origen) {
      throw new NotFoundException(`Dirección de origen con ID ${createDto.origenId} no encontrada`);
    }

    const destino = await this.addressDetailRepository.findOne({
      where: { id: createDto.destinoId },
    });

    if (!destino) {
      throw new NotFoundException(`Dirección de destino con ID ${createDto.destinoId} no encontrada`);
    }

    const tipoCarga = await this.tipocargaRepository.findOne({
      where: { id: createDto.tipoCargaId },
    });

    if (!tipoCarga) {
      throw new NotFoundException(`Tipo de carga con ID ${createDto.tipoCargaId} no encontrado`);
    }

    const tipoTransporte = await this.tipotransporteRepository.findOne({
      where: { id: createDto.tipoTransporteId },
    });

    if (!tipoTransporte) {
      throw new NotFoundException(`Tipo de transporte con ID ${createDto.tipoTransporteId} no encontrado`);
    }

    // TODO: Calcular precio del flete usando el motor de fletes existente
    const precioFlete = 0; // Placeholder - se debe integrar con el servicio de cálculo de fletes

    cita.es_servicio_escatolina = true;
    cita.origen = origen;
    cita.destino = destino;
    cita.tipo_carga = tipoCarga;
    cita.peso_kg = createDto.peso_kg;
    cita.volumen_m3 = createDto.volumen_m3;
    cita.tipo_transporte = tipoTransporte;
    cita.fecha_estimada_viaje = new Date(createDto.fecha_estimada_viaje);
    cita.licencia_operativa = createDto.licencia_operativa;
    cita.precio_flete_escatolina = precioFlete;
    cita.precio_total = cita.precio_servicio_base + precioFlete;

    return this.citaTallerRepository.save(cita);
  }

  async responderCita(id: string, dto: ResponderCitaDto): Promise<CitaTaller> {
    const cita = await this.findOne(id);

    if (cita.estado !== EstadoCita.PENDIENTE) {
      throw new BadRequestException('Solo se puede responder una cita pendiente');
    }

    if (dto.estado === EstadoCita.RECHAZADA && !dto.motivo_rechazo) {
      throw new BadRequestException('Debe proporcionar un motivo de rechazo');
    }

    cita.estado = dto.estado;
    cita.fecha_respuesta_taller = new Date();
    cita.motivo_rechazo = dto.motivo_rechazo || null;

    if (dto.notas_adicionales) {
      cita.notas_adicionales = dto.notas_adicionales;
    }

    return this.citaTallerRepository.save(cita);
  }

  async actualizarEstado(id: string, dto: ActualizarEstadoCitaDto): Promise<CitaTaller> {
    const cita = await this.findOne(id);

    cita.estado = dto.estado;

    if (dto.notas_adicionales) {
      cita.notas_adicionales = dto.notas_adicionales;
    }

    return this.citaTallerRepository.save(cita);
  }

  async findOne(id: string): Promise<CitaTaller> {
    const cita = await this.citaTallerRepository.findOne({
      where: { id },
      relations: ['taller', 'cliente', 'servicio', 'origen', 'destino', 'tipo_carga', 'tipo_transporte'],
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return cita;
  }

  async findByTaller(tallerId: string): Promise<CitaTaller[]> {
    return this.citaTallerRepository.find({
      where: { taller: { id: tallerId } },
      relations: ['cliente', 'servicio'],
      order: { fecha_hora_inicio: 'DESC' },
    });
  }

  async findByCliente(clienteId: string): Promise<CitaTaller[]> {
    return this.citaTallerRepository.find({
      where: { cliente: { id: clienteId } },
      relations: ['taller', 'servicio'],
      order: { fecha_hora_inicio: 'DESC' },
    });
  }

  async findByEstado(tallerId: string, estado: EstadoCita): Promise<CitaTaller[]> {
    return this.citaTallerRepository.find({
      where: { taller: { id: tallerId }, estado },
      relations: ['cliente', 'servicio'],
      order: { fecha_hora_inicio: 'ASC' },
    });
  }

  async consultarDisponibilidad(dto: ConsultaDisponibilidadCitasDto): Promise<{ fecha: Date; slots: string[] }[]> {
    const fechaInicio = new Date(dto.fecha_inicio);
    const fechaFin = new Date(dto.fecha_fin);

    // Obtener todos los horarios del taller
    const horarios = await this.tallerHorarioRepository.find({
      where: { prestatario: { id: dto.tallerId }, activo: true },
    });

    const disponibilidades = [];

    for (let fecha = fechaInicio; fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
      const diaSemana = fecha.getDay();
      const horarioDia = horarios.find((h) => h.dia_semana === diaSemana);

      if (!horarioDia) {
        continue; // El taller no trabaja este día
      }

      // Obtener citas existentes para este día
      const inicioDia = new Date(fecha);
      inicioDia.setHours(0, 0, 0, 0);
      const finDia = new Date(fecha);
      finDia.setHours(23, 59, 59, 999);

      const citasDia = await this.citaTallerRepository.find({
        where: {
          taller: { id: dto.tallerId },
          fecha_hora_inicio: Between(inicioDia, finDia),
          estado: Between(EstadoCita.PENDIENTE, EstadoCita.EN_PROGRESO),
        },
      });

      // Generar slots disponibles (simplificado - cada hora)
      const slots = this.generarSlotsDisponibles(horarioDia, citasDia);
      
      disponibilidades.push({
        fecha: new Date(fecha),
        slots,
      });
    }

    return disponibilidades;
  }

  private generarSlotsDisponibles(horario: TallerHorario, citas: CitaTaller[]): string[] {
    const slots: string[] = [];
    const [horaInicio, minutoInicio] = horario.hora_inicio.split(':').map(Number);
    const [horaFin, minutoFin] = horario.hora_fin.split(':').map(Number);

    // Slots de 1 hora
    for (let hora = horaInicio; hora < horaFin; hora++) {
      const slotHora = `${hora.toString().padStart(2, '0')}:00`;
      
      // Verificar si el slot está ocupado
      const estaOcupado = citas.some((cita) => {
        const citaInicio = new Date(cita.fecha_hora_inicio);
        const citaFin = new Date(cita.fecha_hora_fin);
        const slotInicio = new Date();
        slotInicio.setHours(hora, 0, 0, 0);
        const slotFin = new Date();
        slotFin.setHours(hora + 1, 0, 0, 0);

        return (
          (citaInicio <= slotInicio && slotInicio < citaFin) ||
          (citaInicio < slotFin && slotFin <= citaFin) ||
          (slotInicio <= citaInicio && citaFin <= slotFin)
        );
      });

      if (!estaOcupado) {
        slots.push(slotHora);
      }
    }

    return slots;
  }
}
