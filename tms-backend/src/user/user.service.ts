import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as argon from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { User, TipoCarga, Contenedor } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { Configuracion } from 'src/configuracion/entities/configuracion.entity';
import { Inject, forwardRef } from '@nestjs/common';
// nuevos imports
import { PrestatarioService } from 'src/prestatario/prestatario.service';
import { CreatePrestatarioDto } from 'src/prestatario/dto/create-prestatario.dto';
import { CreateClientDto } from 'src/cliente/dto/create-cliente.dto';
import { ClientService } from 'src/cliente/cliente.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Configuracion)
    private configRepository: Repository<Configuracion>,
    // inyectamos el servicio de prestatario
    private prestatarioService: PrestatarioService,

    @Inject(forwardRef(() => ClientService)) // usa forwardRef si ClientService importa UserService
    private clientService: ClientService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id: userId,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  // validador para email
  async findOneByEmail(userEmail: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: userEmail,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  // validador para username
  async findOneByUserName(userName: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          username: userName,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async editUser(userId: string, dto: UpdateUserDto): Promise<any> {
    // busco el usuario por el ID
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException(`El Id de usuario ${userId} no existe.`);
    }

    if (dto.email) {
      const userExist = await this.findOneByEmail(dto.email);
      if (userExist) {
        if (user.id !== userExist.id) {
          throw new ConflictException(
            `User email ${dto.email} is already taken`,
          );
        }
      }
    }

    if (dto.name) {
      user.name = dto.name;
    }
    if (dto.username) {
      user.username = dto.username;
    }
    if (dto.lastname) {
      user.lastname = dto.lastname;
    }
    if (dto.phone) {
      user.phone = dto.phone;
    }
    if (dto.email) {
      user.email = dto.email;
    }
    if (dto.password) {
      user.hash = await argon.hash(dto.password);
    }
    if (dto.role) {
      const role = await this.roleRepository.findOneBy({ id: dto.role });
      if (!role) {
        throw new ConflictException(
          `Does not exist a role with id: ${dto.role}.`,
        );
      }
      user.role = role;
    }

    const updated = await this.userRepository.save(user);
    // devolver usuario actualizado (sin hash)
    delete (updated as any).hash;
    return updated;
  }

  async deleteUser(userId: string) {
    // busco el usuario por el ID
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    // si no existe retorno un error personalizado
    if (!user) {
      throw new ConflictException(`El Id de usuario ${userId} no existe.`);
    }
    return await this.userRepository.remove(user);
  }

  async createUser(dto: CreateUserDto): Promise<any> {
    // validaciones básicas existentes
    const user = await this.findOneByUserName(dto.username);
    if (user) {
      throw new ConflictException(
        `Exist a user with the username: ${dto.username}. `,
      );
    }

    const userByEmail = await this.findOneByEmail(dto.email);
    if (userByEmail) {
      throw new ConflictException(`Exist a user with the email: ${dto.email}.`);
    }

    const hash = await argon.hash(dto.password);

    // Validar rol
    const role = await this.roleRepository.findOneBy({ id: dto.role });
    if (!role) {
      throw new ConflictException(
        `Does not exist a role with id: ${dto.role}. `,
      );
    }

    let code = 0;
    // inserto el nuevo usuario
    const new_user = new User();
    new_user.name = dto.name;
    new_user.comercial_code = code;
    new_user.email = dto.email;
    new_user.hash = hash;
    new_user.role = role;
    new_user.username = dto.username;
    new_user.phone = dto.phone;
    new_user.description = dto.description;
    new_user.lastname = dto.lastname;

    // --- Si el rol es 'prestatario' guardamos los campos extra si vienen ---
    const roleName = (role?.name || '').toLowerCase();

    const saved = await this.userRepository.save(new_user);
    delete saved.hash;

    if (roleName === 'cliente') {
      const clientDto: CreateClientDto = {
        company: (dto as any).client.company,
        contact_name: (dto as any).client.contact_name,
        contact_phone: (dto as any).client.contact_phone,
        tax_id: (dto as any).client.tax_id,
        address: (dto as any).client.address,
        modalidad: (dto as any).client.modalidad,
      } as any;
      try {
        await this.clientService.createFromUser(clientDto, saved);
      } catch (err) {
        // si falla la creación del prestatario, eliminamos el user creado para evitar inconsistencia
        try {
          await this.userRepository.remove(saved);
        } catch (removeErr) {
          // si falla también el remove, dejamos el error original para que el caller lo vea
          console.error(
            'Error removing user after prestatario creation failure',
            removeErr,
          );
        }
        throw err;
      }
    }
    // Si es prestatario: crear prestatario automáticamente usando PrestatarioService
    if (roleName === 'prestatario') {
      /**
       * Construimos createPDto mapeando defensivamente
       * desde camelCase (frontend) o snake_case (posiblemente DTO anteriores).
       */
      const anyDto = dto as any;
      const createPDto: CreatePrestatarioDto = {
        tipoCarga: anyDto.tipoCarga ?? anyDto.tipo_carga,
        contenedor: anyDto.contenedor,
        transportes: anyDto.transportes ?? [],
        ayudantes: anyDto.ayudantes ?? [],
        cargasEspeciales:
          anyDto.cargasEspeciales ?? anyDto.cargas_especiales ?? [],
        rating: anyDto.rating ?? null,
        licencia: anyDto.licencia ?? anyDto.licence ?? null,
        // capacidades
        maxWeight: anyDto.maxWeight ?? anyDto.max_weight ?? null,
        maxVolume: anyDto.maxVolume ?? anyDto.max_volume ?? null,
        servicios: anyDto.servicios ?? anyDto.servicios ?? [],

        // ALQUILER (soportamos camelCase y snake_case)
        providesAlquiler: !!(
          anyDto.providesAlquiler ?? anyDto.provides_alquiler
        ),
        metros_disponibles_alquiler:
          anyDto.metrosDisponiblesAlquiler ??
          anyDto.metros_disponibles_alquiler ??
          null,
        altura_m_alquiler:
          anyDto.alturaMAlquiler ?? anyDto.altura_m_alquiler ?? null,
        servicios_prest_alquiler:
          anyDto.serviciosPrestAlquiler ??
          anyDto.servicios_prest_alquiler ??
          [],

        // TALLERES
        providesTalleres: !!(
          anyDto.providesTalleres ?? anyDto.provides_talleres
        ),
        talleres_num_tecnicos:
          anyDto.talleresNumTecnicos ?? anyDto.talleres_num_tecnicos ?? null,
        talleres_horario:
          anyDto.talleresHorario ?? anyDto.talleres_horario ?? '',
        talleres_servicios:
          anyDto.talleresServicios ?? anyDto.talleres_servicios ?? [],
        talleres_capacidad_vehiculos:
          anyDto.talleresCapacidadVehiculos ??
          anyDto.talleres_capacidad_vehiculos ??
          null,

        // GPS
        providesGPS: !!(anyDto.providesGPS ?? anyDto.provides_gps),
        gps_providers: anyDto.gpsProviders ?? anyDto.gps_providers ?? [],
        gps_devices_available:
          anyDto.gpsDevicesAvailable ?? anyDto.gps_devices_available ?? null,
        gps_plans: anyDto.gpsPlans ?? anyDto.gps_plans ?? '',
        gps_integration_api: !!(
          anyDto.gpsIntegrationApi ?? anyDto.gps_integration_api
        ),

        // ALOJAMIENTO
        providesAlojamiento: !!(
          anyDto.providesAlojamiento ?? anyDto.provides_alojamiento
        ),
        habitaciones_disponibles:
          anyDto.habitacionesDisponibles ??
          anyDto.habitaciones_disponibles ??
          null,
        capacidad_personas:
          anyDto.capacidadPersonas ?? anyDto.capacidad_personas ?? null,
        precio_noche_promedio:
          anyDto.precioNochePromedio ?? anyDto.precio_noche_promedio ?? null,
        tipo_habitaciones:
          anyDto.tipoHabitaciones ?? anyDto.tipo_habitaciones ?? [],
        servicios_incluidos_alojamiento:
          anyDto.serviciosIncluidosAlojamiento ??
          anyDto.servicios_incluidos_alojamiento ??
          [],
      } as any;

      try {
        // la función espera (dto, user)
        await this.prestatarioService.createFromUser(createPDto, saved);
      } catch (err) {
        // si falla la creación del prestatario, eliminamos el user creado para evitar inconsistencia
        try {
          await this.userRepository.remove(saved);
        } catch (removeErr) {
          // si falla también el remove, dejamos el error original para que el caller lo vea
          console.error(
            'Error removing user after prestatario creation failure',
            removeErr,
          );
        }
        throw err;
      }
    }

    return saved;
  }
}
