import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Peticion, PeticionStatus } from './entities/peticion.entity';
import { CreatePeticionDto } from './dto/create-peticion.dto';
import { Client } from 'src/cliente/entities/cliente.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { Proposal } from 'src/proposal/entities/proposal.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from 'src/user/entities/user.entity';
import { NotificationType } from 'src/notifications/entities/notification.entity';
import { UpdatePeticionDto } from './dto/update-peticion.dto';

@Injectable()
export class PeticionService {
  private readonly logger = new Logger(PeticionService.name);

  constructor(
    @InjectRepository(Peticion)
    private readonly peticionRepo: Repository<Peticion>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,

    @InjectRepository(Prestatario)
    private readonly prestatarioRepo: Repository<Prestatario>,

    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,

    private readonly notificationsService: NotificationsService,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crear peticion (cliente autenticado)
   */
  async create(dto: CreatePeticionDto, user: User): Promise<Peticion> {
    if (!user) {
      throw new BadRequestException('Usuario no autenticado');
    }

    const client = await this.clientRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!client) {
      throw new NotFoundException(
        'Perfil de cliente no encontrado para este usuario',
      );
    }

    const pet = this.peticionRepo.create({
      nombreEntidad: dto.nombreEntidad,
      nombreCarga: dto.nombreCarga,
      peso: dto.peso,
      volumen: dto.volumen,
      origen: dto.origen,
      destino: dto.destino,
      tipoCarga: dto.tipoCarga,
      cliente: client,
      status: 'abierta' as PeticionStatus,
    });

    return this.peticionRepo.save(pet);
  }

  /**
   * Listar peticiones accesibles para el usuario (filtros opcionales)
   */
  async listForUser(
    user: User,
    filters?: {
      tipoCarga?: string;
      status?: string;
      limit?: number;
      offset?: number;
      clienteId?: string;
    },
  ): Promise<Peticion[]> {
    const qb = this.peticionRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.cliente', 'cliente')
      .leftJoinAndSelect('cliente.user', 'cliente_user');

    const roleName = user?.role?.name?.toLowerCase?.();

    if (roleName === 'cliente' || roleName === 'client') {
      const client = await this.clientRepo.findOne({
        where: { user: { id: user.id } },
      });
      if (!client)
        throw new NotFoundException('Perfil de cliente no encontrado');
      qb.andWhere('p.cliente = :clientId', { clientId: client.id });
    } else if (roleName === 'administrador' || roleName === 'admin') {
      // admin: no filtro
    } else if (filters?.clienteId) {
      qb.andWhere('p.cliente = :clientId', { clientId: filters.clienteId });
    } else {
      const client = await this.clientRepo.findOne({
        where: { user: { id: user.id } },
      });
      if (client) qb.andWhere('p.cliente = :clientId', { clientId: client.id });
    }

    if (filters?.tipoCarga)
      qb.andWhere('p.tipoCarga = :tipoCarga', { tipoCarga: filters.tipoCarga });
    if (filters?.status)
      qb.andWhere('p.status = :status', { status: filters.status });
    qb.orderBy('p.createdAt', 'DESC');

    if (filters?.limit) qb.limit(filters.limit);
    if (filters?.offset) qb.offset(filters.offset);

    return qb.getMany();
  }

  /**
   * Obtener 1 peticion por id
   */
  async getOne(id: string): Promise<Peticion> {
    const p = await this.peticionRepo.findOne({
      where: { id },
      relations: ['cliente', 'cliente.user', 'assignedProposal'],
    });
    if (!p) throw new NotFoundException('Petición no encontrada');
    return p;
  }

  /**
   * Obtener prestatarios compatibles para una peticion
   */
  async getCompatiblePrestatarios(peticionId: string): Promise<Prestatario[]> {
    const pet = await this.peticionRepo.findOne({ where: { id: peticionId } });
    if (!pet) throw new NotFoundException('Petición no encontrada');

    if (!pet.tipoCarga) return [];

    const prestamos = await this.prestatarioRepo.find({
      where: { tipoCarga: pet.tipoCarga as any },
    });

    return prestamos;
  }

  /**
   * Cliente acepta la asignación de una proposal para esta peticion.
   */
  async acceptAssignment(peticionId: string, proposalId: string, actor: User) {
    return this.dataSource.transaction(async (em) => {
      const petRepo = em.getRepository(Peticion);
      const propRepo = em.getRepository(Proposal);
      const clientRepo = em.getRepository(Client);

      const pet = await petRepo.findOne({
        where: { id: peticionId },
        relations: ['cliente', 'cliente.user', 'assignedProposal'],
      });
      if (!pet) throw new NotFoundException('Petición no encontrada');

      const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';

      const ownerUserId = (pet.cliente as any)?.user?.id ?? null;
      if (!isAdmin && ownerUserId && String(ownerUserId) !== String(actor.id)) {
        throw new ForbiddenException(
          'No autorizado para aceptar asignación de esta petición',
        );
      }

      const proposal = await propRepo.findOne({
        where: { id: proposalId },
        relations: ['prestatario', 'prestatario.user', 'peticion'],
      });
      if (!proposal) throw new NotFoundException('Proposal no encontrada');

      if (
        !proposal.peticion ||
        String(proposal.peticion.id) !== String(pet.id)
      ) {
        throw new BadRequestException(
          'La proposal no corresponde a la petición',
        );
      }

      if (proposal.status !== 'accepted') {
        throw new BadRequestException(
          'Solo proposals en estado "accepted" pueden ser confirmadas por el cliente',
        );
      }

      pet.status = 'asignada' as PeticionStatus;
      pet.assignedProposal = proposal as any;

      await petRepo.save(pet);

      try {
        const prestatUserId = proposal.prestatario?.user?.id ?? null;
        if (prestatUserId && this.notificationsService) {
          await this.notificationsService.createNotification({
            title: 'Asignación confirmada por cliente',
            message: `El cliente confirmó la asignación de la petición ${pet.nombreCarga ?? pet.id}.`,
            type: NotificationType.PROPOSAL_CONFIRMED,
            link: `/app/petitions/${pet.id}`,
            meta: { peticionId: pet.id, proposalId: proposal.id },
            userTargetId: prestatUserId,
            userOriginId: actor.id,
          });
        }
      } catch (err) {
        this.logger.warn(
          'Fallo creando notificación tras acceptAssignment: ' +
            (err instanceof Error ? err.message : JSON.stringify(err)),
        );
      }

      return { ok: true, peticion: pet, proposal };
    });
  }

  /**
   * Actualizar una petición por id.
   *
   * Importante: para evitar el bug de joinEagerRelations/callstack usamos QueryBuilder
   * para traer *solo* lo necesario (owner id y status) y no disparar recorrido eager recursivo.
   */
  async update(
    peticionId: string,
    dto: UpdatePeticionDto,
    actor: User,
  ): Promise<Peticion> {
    this.logger.debug(
      `[PeticionService.update] start peticionId=${peticionId} actor=${actor?.id}`,
    );
    try {
      // 1) obtener petición con QueryBuilder (solo lo necesario)
      const pet = await this.peticionRepo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.cliente', 'cliente')
        .leftJoinAndSelect('cliente.user', 'cliente_user')
        .leftJoinAndSelect('p.assignedProposal', 'assignedProposal')
        .where('p.id = :id', { id: peticionId })
        .getOne();

      this.logger.debug(
        '[PeticionService.update] find returned pet id=%s',
        pet?.id,
      );
      if (!pet) throw new NotFoundException('Petición no encontrada');

      const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
      const ownerUserId = (pet.cliente as any)?.user?.id ?? null;
      if (!isAdmin && ownerUserId && String(ownerUserId) !== String(actor.id)) {
        throw new ForbiddenException('No autorizado para editar esta petición');
      }

      const finalStates = ['asignada', 'usada'];
      if (finalStates.includes(String(pet.status || '').toLowerCase())) {
        throw new BadRequestException(
          'No se puede editar una petición en estado final',
        );
      }

      if (dto.nombreEntidad !== undefined)
        pet.nombreEntidad = dto.nombreEntidad;
      if (dto.nombreCarga !== undefined) pet.nombreCarga = dto.nombreCarga;
      if (dto.peso !== undefined) pet.peso = dto.peso;
      if (dto.volumen !== undefined) pet.volumen = dto.volumen;
      if (dto.origen !== undefined) pet.origen = dto.origen;
      if (dto.destino !== undefined) pet.destino = dto.destino;
      if (dto.tipoCarga !== undefined) pet.tipoCarga = dto.tipoCarga;

      this.logger.debug('[PeticionService.update] saving pet...');
      const saved = await this.peticionRepo.save(pet);
      this.logger.debug('[PeticionService.update] saved id=%s', saved.id);

      return saved;
    } catch (err: unknown) {
      const stack =
        err instanceof Error
          ? (err.stack ?? err.message)
          : typeof err === 'object'
            ? (() => {
                try {
                  return JSON.stringify(err);
                } catch {
                  return String(err);
                }
              })()
            : String(err);
      this.logger.error('[PeticionService.update] ERROR: %s', stack);
      throw err;
    }
  }

  /**
   * Eliminar una petición por id.
   * - solo owner (cliente) o admin pueden eliminar
   * - no permitir eliminar si la petición está en estado final (asignada/usada) o tiene assignedProposal
   */
  async remove(peticionId: string, actor: User): Promise<{ ok: true }> {
    this.logger.debug(
      `[PeticionService.remove] start peticionId=${peticionId} actor=${actor?.id}`,
    );
    try {
      // traer sólo lo necesario con QueryBuilder para evitar traversal de eager relations
      const pet = await this.peticionRepo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.cliente', 'cliente')
        .leftJoinAndSelect('cliente.user', 'cliente_user')
        .leftJoinAndSelect('p.assignedProposal', 'assignedProposal')
        .where('p.id = :id', { id: peticionId })
        .getOne();

      this.logger.debug('[PeticionService.remove] found pet id=%s', pet?.id);
      if (!pet) throw new NotFoundException('Petición no encontrada');

      // permisos
      const isAdmin = actor.role?.name?.toLowerCase?.() === 'administrador';
      const ownerUserId = (pet.cliente as any)?.user?.id ?? null;
      if (!isAdmin && ownerUserId && String(ownerUserId) !== String(actor.id)) {
        throw new ForbiddenException(
          'No autorizado para eliminar esta petición',
        );
      }

      // no permitir eliminar si en estado final o tiene assignedProposal
      const finalStates = ['asignada', 'usada'];
      if (finalStates.includes(String(pet.status || '').toLowerCase())) {
        throw new BadRequestException(
          'No se puede eliminar una petición en estado final',
        );
      }
      if (pet.assignedProposal) {
        throw new BadRequestException(
          'No se puede eliminar una petición que ya tiene una proposal asignada',
        );
      }

      // realizar delete (usamos delete por id para evitar cascadas inesperadas)
      const del = await this.peticionRepo.delete({ id: peticionId });
      if (del.affected === 0) {
        // improbable porque ya tuvimos pet, pero por seguridad:
        throw new NotFoundException('Petición no encontrada (al eliminar)');
      }

      this.logger.debug('[PeticionService.remove] deleted id=%s', peticionId);
      return { ok: true };
    } catch (err: unknown) {
      const stack =
        err instanceof Error
          ? (err.stack ?? err.message)
          : typeof err === 'object'
            ? (() => {
                try {
                  return JSON.stringify(err);
                } catch {
                  return String(err);
                }
              })()
            : String(err);
      this.logger.error('[PeticionService.remove] ERROR: %s', stack);
      throw err;
    }
  }
}
