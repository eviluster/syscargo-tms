// src/prestatario/prestatario.service.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestatario, TipoCarga } from './entities/prestatario.entity';
import { CreatePrestatarioDto } from './dto/create-prestatario.dto';
import { User } from 'src/user/entities/user.entity';
import { Proposal } from 'src/proposal/entities/proposal.entity';
import { CreateProposalDto } from 'src/proposal/dto/create-proposal.dto';
import { Carga } from 'src/carga/entities/carga.entity';
import { ViaMode } from 'src/carga/enum/vias';
import { Brackets } from 'typeorm';

type ServiceKey = 'alojamiento' | 'gps' | 'talleres';

@Injectable()
export class PrestatarioService {
  constructor(
    @InjectRepository(Prestatario)
    private prestatarioRepo: Repository<Prestatario>,

    @InjectRepository(Carga)
    private readonly cargaRepo: Repository<Carga>,

    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
  ) {}

  async findAll(): Promise<Prestatario[]> {
    return this.prestatarioRepo.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Crea un prestatario vinculado al user.
   * Llamar desde UserService.createUser(...) cuando role === 'prestatario'.
   */
  // reemplazar createFromUser por esta versión
  async createFromUser(
    dto: CreatePrestatarioDto,
    user: User,
  ): Promise<Prestatario> {
    console.log('CreatePrestatarioDto', dto);

    const existing = await this.prestatarioRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (existing)
      throw new BadRequestException(
        'El usuario ya tiene un registro de prestatario',
      );

    // Normalizar servicios defensivamente
    const servicios = (dto as any).servicios ?? [];

    // Mapear alquiler / talleres / gps / alojamiento: aceptar camelCase y snake_case
    const metrosDisponiblesAlquiler =
      (dto as any).metrosDisponiblesAlquiler ??
      (dto as any).metros_disponibles_alquiler ??
      null;
    const alturaMAlquiler =
      (dto as any).alturaMAlquiler ?? (dto as any).altura_m_alquiler ?? null;
    const serviciosPrestAlquiler =
      (dto as any).serviciosPrestAlquiler ??
      (dto as any).servicios_prest_alquiler ??
      [];

    const talleresNumTecnicos =
      (dto as any).talleresNumTecnicos ??
      (dto as any).talleres_num_tecnicos ??
      null;
    const talleresHorario =
      (dto as any).talleresHorario ?? (dto as any).talleres_horario ?? '';
    const talleresServicios =
      (dto as any).talleresServicios ?? (dto as any).talleres_servicios ?? [];
    const talleresCapacidadVehiculos =
      (dto as any).talleresCapacidadVehiculos ??
      (dto as any).talleres_capacidad_vehiculos ??
      null;

    const gpsProviders =
      (dto as any).gpsProviders ?? (dto as any).gps_providers ?? [];
    const gpsDevicesAvailable =
      (dto as any).gpsDevicesAvailable ??
      (dto as any).gps_devices_available ??
      null;
    const gpsPlans = (dto as any).gpsPlans ?? (dto as any).gps_plans ?? '';
    const gpsIntegrationApi = !!(
      (dto as any).gpsIntegrationApi ?? (dto as any).gps_integration_api
    );

    const habitacionesDisponibles =
      (dto as any).habitacionesDisponibles ??
      (dto as any).habitaciones_disponibles ??
      null;
    const capacidadPersonas =
      (dto as any).capacidadPersonas ?? (dto as any).capacidad_personas ?? null;
    const precioNochePromedio =
      (dto as any).precioNochePromedio ??
      (dto as any).precio_noche_promedio ??
      null;
    const tipoHabitaciones =
      (dto as any).tipoHabitaciones ?? (dto as any).tipo_habitaciones ?? [];
    const serviciosIncluidosAlojamiento =
      (dto as any).serviciosIncluidosAlojamiento ??
      (dto as any).servicios_incluidos_alojamiento ??
      [];

    // Crear la entidad usando **camelCase** (coincide con tu entidad actual)
    const p = this.prestatarioRepo.create({
      user: user,
      name: `${user.name} ${user.lastname}`,
      tipoCarga: (dto as any).tipoCarga ?? null,
      contenedor: (dto as any).contenedor ?? null,
      transportes: (dto as any).transportes ?? [],
      ayudantes: (dto as any).ayudantes ?? [],
      cargasEspeciales: (dto as any).cargasEspeciales ?? [],
      rating: (dto as any).rating ?? null,
      licencia: (dto as any).licencia ?? null,
      maxWeight: (dto as any).maxWeight ?? null,
      maxVolume: (dto as any).maxVolume ?? null,
      servicios: servicios ?? null,
      conditions: (dto as any).conditions ?? null,

      // --- campos nuevos (camelCase) ---
      metrosDisponiblesAlquiler: metrosDisponiblesAlquiler,
      alturaMAlquiler: alturaMAlquiler,
      serviciosPrestAlquiler: serviciosPrestAlquiler,

      talleresNumTecnicos: talleresNumTecnicos,
      talleresHorario: talleresHorario,
      talleresServicios: talleresServicios,
      talleresCapacidadVehiculos: talleresCapacidadVehiculos,

      gpsProviders: gpsProviders,
      gpsDevicesAvailable: gpsDevicesAvailable,
      gpsPlans: gpsPlans,
      gpsIntegrationApi: gpsIntegrationApi,

      habitacionesDisponibles: habitacionesDisponibles,
      capacidadPersonas: capacidadPersonas,
      precioNochePromedio: precioNochePromedio,
      tipoHabitaciones: tipoHabitaciones,
      serviciosIncluidosAlojamiento: serviciosIncluidosAlojamiento,
    } as any);

    console.log('Prestatario antes de guardar', p);

    const savedResult = await this.prestatarioRepo.save(p);
    const saved = Array.isArray(savedResult)
      ? savedResult[0]
      : (savedResult as Prestatario);

    if (!saved || !saved.id) {
      throw new Error('Unexpected saved result from prestatarioRepo.save');
    }

    return this.prestatarioRepo.findOne({ where: { id: saved.id } });
  }

  /** Crear manual (admin) */
  async create(dto: CreatePrestatarioDto, user: User): Promise<Prestatario> {
    return this.createFromUser(dto, user);
  }

  /** Obtener por id */
  async findOneById(id: string): Promise<Prestatario> {
    const p = await this.prestatarioRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Prestatario ${id} no encontrado`);
    return p;
  }

  /** Obtener por user id */
  async findOneByUserId(userId: string): Promise<Prestatario> {
    const p = await this.prestatarioRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!p)
      throw new NotFoundException(
        `Prestatario para user ${userId} no encontrado`,
      );
    return p;
  }

  async findMatchingByCapacity(
    tipoCarga: TipoCarga,
    weight?: number,
    volume?: number,
    via?: ViaMode,
    limit = 50,
  ): Promise<Prestatario[]> {
    if (!tipoCarga) {
      throw new BadRequestException('tipoCarga es requerido');
    }

    const qb = this.prestatarioRepo
      .createQueryBuilder('p')
      .where('p.tipoCarga = :tipoCarga', { tipoCarga });

    qb.leftJoinAndSelect('p.user', 'user');

    // filtro por capacidad (igual que antes)
    if (weight != null && volume != null) {
      qb.andWhere(
        '( (p.maxWeight IS NOT NULL AND p.maxWeight >= :weight) OR (p.maxVolume IS NOT NULL AND p.maxVolume >= :volume) )',
        { weight, volume },
      );
    } else if (weight != null) {
      qb.andWhere('p.maxWeight IS NOT NULL AND p.maxWeight >= :weight', {
        weight,
      });
    } else if (volume != null) {
      qb.andWhere('p.maxVolume IS NOT NULL AND p.maxVolume >= :volume', {
        volume,
      });
    }

    // filtro por vía: el prestatario debe soportar la misma vía O 'multimodal'
    if (via) {
      // Normalizamos a string por si ViaMode es enum
      const viaStr = String(via);
      const multiStr = 'multimodal';

      // Usamos Postgres ANY sobre arreglo p.servicios
      // rechazamos prestatarios sin 'servicios' explícito (seguridad)
      qb.andWhere(
        'p.servicios IS NOT NULL AND ( :via = ANY(p.servicios) OR :multi = ANY(p.servicios) )',
        { via: viaStr, multi: multiStr },
      );
    }

    qb.orderBy('p.rating', 'DESC').limit(limit);

    return qb.getMany();
  }

  /**
   * Propone una carga a un prestatario:
   * - valida existencia de carga y prestatario
   * - valida que el usuario que propone sea dueño de la carga (o admin)
   * - crea un registro Proposal
   */

  /** Actualizar */
  async update(
    id: string,
    dto: Partial<CreatePrestatarioDto>,
  ): Promise<Prestatario> {
    const p = await this.findOneById(id);
    // mezclar cambios (no sobreescribimos si campo undefined)
    if (dto.tipoCarga !== undefined) p.tipoCarga = dto.tipoCarga;
    if (dto.contenedor !== undefined) p.contenedor = dto.contenedor;
    if (dto.transportes !== undefined) p.transportes = dto.transportes;
    if (dto.ayudantes !== undefined) p.ayudantes = dto.ayudantes;
    if (dto.cargasEspeciales !== undefined)
      p.cargasEspeciales = dto.cargasEspeciales;
    if (dto.rating !== undefined) p.rating = dto.rating;
    if (dto.licencia !== undefined) p.licencia = dto.licencia;
    if (dto.maxVolume !== undefined) p.maxVolume = dto.maxVolume;
    if (dto.maxWeight !== undefined) p.maxWeight = dto.maxWeight;
    if (dto.servicios !== undefined) p.servicios = dto.servicios;
    if (dto.conditions !== undefined) p.conditions = dto.conditions;

    // Compatibilidad: aceptar tanto camelCase como snake_case en update DTO

    const anyDto = dto as any;

    // alquiler (camelCase)
    if (anyDto.metrosDisponiblesAlquiler !== undefined)
      p.metrosDisponiblesAlquiler = anyDto.metrosDisponiblesAlquiler;
    if (anyDto.alturaMAlquiler !== undefined)
      p.alturaMAlquiler = anyDto.alturaMAlquiler;
    if (anyDto.serviciosPrestAlquiler !== undefined)
      p.serviciosPrestAlquiler = anyDto.serviciosPrestAlquiler;

    // talleres (camelCase)
    if (anyDto.talleresNumTecnicos !== undefined)
      p.talleresNumTecnicos = anyDto.talleresNumTecnicos;
    if (anyDto.talleresHorario !== undefined)
      p.talleresHorario = anyDto.talleresHorario;
    if (anyDto.talleresServicios !== undefined)
      p.talleresServicios = anyDto.talleresServicios;
    if (anyDto.talleresCapacidadVehiculos !== undefined)
      p.talleresCapacidadVehiculos = anyDto.talleresCapacidadVehiculos;

    // GPS (camelCase)
    if (anyDto.gpsProviders !== undefined) p.gpsProviders = anyDto.gpsProviders;
    if (anyDto.gpsDevicesAvailable !== undefined)
      p.gpsDevicesAvailable = anyDto.gpsDevicesAvailable;
    if (anyDto.gpsPlans !== undefined) p.gpsPlans = anyDto.gpsPlans;
    if (anyDto.gpsIntegrationApi !== undefined)
      p.gpsIntegrationApi = anyDto.gpsIntegrationApi;

    // alojamiento (camelCase)
    if (anyDto.habitacionesDisponibles !== undefined)
      p.habitacionesDisponibles = anyDto.habitacionesDisponibles;
    if (anyDto.capacidadPersonas !== undefined)
      p.capacidadPersonas = anyDto.capacidadPersonas;
    if (anyDto.precioNochePromedio !== undefined)
      p.precioNochePromedio = anyDto.precioNochePromedio;
    if (anyDto.tipoHabitaciones !== undefined)
      p.tipoHabitaciones = anyDto.tipoHabitaciones;
    if (anyDto.serviciosIncluidosAlojamiento !== undefined)
      p.serviciosIncluidosAlojamiento = anyDto.serviciosIncluidosAlojamiento;

    await this.prestatarioRepo.save(p);
    return this.findOneById(id);
  }

  /** Eliminar */
  async remove(id: string): Promise<void> {
    const p = await this.findOneById(id);
    await this.prestatarioRepo.remove(p);
  }

  /**
   * Match por espacio (alquiler): metros + altura
   * Endpoint frontend: /prestatario/match-space?metros=XX&altura=YY&limit=50
   */
  async findMatchingBySpace(
    metros: number | undefined,
    altura: number | undefined,
    limit = 50,
  ): Promise<Prestatario[]> {
    if (metros == null || altura == null) {
      throw new BadRequestException('metros y altura son requeridos');
    }

    const qb = this.prestatarioRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'user');

    qb.where(
      'p.metrosDisponiblesAlquiler IS NOT NULL AND p.metrosDisponiblesAlquiler >= :metros',
      { metros },
    )
      .andWhere(
        'p.alturaMAlquiler IS NOT NULL AND p.alturaMAlquiler >= :altura',
        { altura },
      )
      .orderBy('p.rating', 'DESC')
      .limit(limit);

    return qb.getMany();
  }

  /**
   * Match para Alojamiento
   * Buscamos prestatarios que tengan habitacionesDisponibles >= habitaciones OR capacidadPersonas >= personas.
   * Disponibilidad por fecha no se puede comprobar si no tienes una tabla de reservas/ocupación, así que no la aplicamos aquí.
   *
   * Endpoint frontend: /prestatario/match-alojamiento?habitaciones=2&personas=4&limit=50
   */
  async findMatchingByAlojamiento(
    habitaciones?: number,
    personas?: number,
    fechaInicio?: string, // opcional, no usado si no hay calendar/reservas
    fechaFin?: string, // opcional
    limit = 50,
  ): Promise<Prestatario[]> {
    const qb = this.prestatarioRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'user');

    // Si no pasan criterios numéricos, devolvemos prestatarios que tengan datos relevantes de alojamiento
    if (habitaciones == null && personas == null) {
      qb.where(
        new Brackets((b) => {
          b.where('p.habitacionesDisponibles IS NOT NULL')
            .orWhere('p.capacidadPersonas IS NOT NULL')
            .orWhere('p.precioNochePromedio IS NOT NULL')
            .orWhere(
              'p.tipoHabitaciones IS NOT NULL AND jsonb_array_length(p.tipoHabitaciones) > 0',
            )
            .orWhere(
              'p.serviciosIncluidosAlojamiento IS NOT NULL AND jsonb_array_length(p.serviciosIncluidosAlojamiento) > 0',
            );
        }),
      );
    } else {
      qb.where(
        new Brackets((b) => {
          if (habitaciones != null) {
            b.andWhere(
              'p.habitacionesDisponibles IS NOT NULL AND p.habitacionesDisponibles >= :habitaciones',
              { habitaciones },
            );
          }
          if (personas != null) {
            // si ambos existen, exigir ambas condiciones; si solo uno existe, filtrar por ese
            b.andWhere(
              'p.capacidadPersonas IS NOT NULL AND p.capacidadPersonas >= :personas',
              { personas },
            );
          }
        }),
      );
    }

    qb.orderBy('p.rating', 'DESC').limit(limit);

    return qb.getMany();
  }

  /**
   * Match para Taller:
   * - tipoTrabajo puede ser: string (CSV), string[] (varios), o undefined.
   * - si vienen tipos, devolvemos prestatarios donde talleresServicios contiene al menos uno.
   * - si no vienen tipos, fallback a prestatarios que declaran servicios de taller.
   */
  async findMatchingByTaller(
    tipoTrabajo?: string | string[] | null,
    limit = 50,
  ): Promise<Prestatario[]> {
    const qb = this.prestatarioRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'user');

    // normalizar a array de strings limpios
    let tipos: string[] = [];
    if (Array.isArray(tipoTrabajo)) {
      tipos = tipoTrabajo.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tipoTrabajo === 'string' && tipoTrabajo.trim() !== '') {
      // acepta CSV: "Mantenimiento,Diagnóstico" o single string
      tipos = tipoTrabajo
        .split(',')
        .map((t) => String(t).trim())
        .filter(Boolean);
    }

    if (tipos.length > 0) {
      // existe al menos uno de los tipos: se usa jsonb_array_elements_text + IN (:...tipos)
      // Nota: usamos EXISTS(...) para eficiencia
      qb.where(
        `p.talleresServicios IS NOT NULL AND EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(p.talleresServicios) elem WHERE elem IN (:...tipos)
        )`,
      ).setParameter('tipos', tipos);
    } else {
      // fallback: prestatarios que declaran capacidades/servicios de taller
      qb.where(
        new Brackets((b) => {
          b.where('p.talleresNumTecnicos IS NOT NULL')
            .orWhere('p.talleresCapacidadVehiculos IS NOT NULL')
            .orWhere(
              'p.talleresServicios IS NOT NULL AND jsonb_array_length(p.talleresServicios) > 0',
            );
        }),
      );
    }

    qb.orderBy('p.rating', 'DESC').limit(Math.max(1, limit));
    return qb.getMany();
  }

  /**
   * Match para GPS:
   * - Solo usamos deviceCount (gpsDevicesAvailable).
   * - si deviceCount viene -> filtro por p.gpsDevicesAvailable >= deviceCount
   * - si no viene -> fallback a prestatarios con datos GPS
   */
  async findMatchingByGps(
    deviceCount?: number | null,
    limit = 50,
  ): Promise<Prestatario[]> {
    const qb = this.prestatarioRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'user');

    if (deviceCount != null && !Number.isNaN(Number(deviceCount))) {
      qb.where(
        'p.gpsDevicesAvailable IS NOT NULL AND p.gpsDevicesAvailable >= :deviceCount',
        {
          deviceCount: Number(deviceCount),
        },
      );
    } else {
      // fallback: prestatarios con info GPS
      qb.where(
        new Brackets((b) => {
          b.where('p.gpsDevicesAvailable IS NOT NULL')
            .orWhere("p.gpsPlans IS NOT NULL AND p.gpsPlans <> ''")
            .orWhere('p.gpsIntegrationApi = TRUE');
        }),
      );
    }

    qb.orderBy('p.rating', 'DESC').limit(Math.max(1, limit));
    return qb.getMany();
  }

  /**
   * Buscar prestatarios por 'servicio' genérico.
   * Mantiene compatibilidad con tu controlador que llama e.g. findByService('alojamiento'|'gps'|'taller'|'talleres').
   */
  async findByService(
    serviceKey: string,
    limit = 20,
    page = 1,
  ): Promise<Prestatario[]> {
    const qb = this.prestatarioRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'user');

    const offset = (Math.max(1, page) - 1) * Math.max(1, limit);

    if (serviceKey === 'alojamiento') {
      qb.where(
        new Brackets((b) => {
          b.where('p.habitacionesDisponibles IS NOT NULL')
            .orWhere('p.capacidadPersonas IS NOT NULL')
            .orWhere('p.precioNochePromedio IS NOT NULL')
            .orWhere(
              'p.tipoHabitaciones IS NOT NULL AND jsonb_array_length(p.tipoHabitaciones) > 0',
            )
            .orWhere(
              'p.serviciosIncluidosAlojamiento IS NOT NULL AND jsonb_array_length(p.serviciosIncluidosAlojamiento) > 0',
            );
        }),
      );
    } else if (serviceKey === 'gps') {
      qb.where(
        new Brackets((b) => {
          b.where('p.gpsDevicesAvailable IS NOT NULL')
            .orWhere("p.gpsPlans IS NOT NULL AND p.gpsPlans <> ''")
            .orWhere('p.gpsIntegrationApi = TRUE');
        }),
      );
    } else if (serviceKey === 'taller' || serviceKey === 'talleres') {
      qb.where(
        new Brackets((b) => {
          b.where('p.talleresNumTecnicos IS NOT NULL')
            .orWhere('p.talleresCapacidadVehiculos IS NOT NULL')
            .orWhere(
              'p.talleresServicios IS NOT NULL AND jsonb_array_length(p.talleresServicios) > 0',
            );
        }),
      );
    } else {
      // fallback: devolver todos (o lanzar error)
      throw new BadRequestException('ServiceKey no soportado');
    }

    qb.orderBy('p.rating', 'DESC').limit(Math.max(1, limit)).offset(offset);

    return qb.getMany();
  }
}
