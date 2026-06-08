import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrestatarioservService } from './prestatarioserv.service';
import { Prestatarioserv } from './entities/prestatarioserv.entity';
import { Prestatario } from 'src/prestatario/entities/prestatario.entity';
import { Servicio } from 'src/servicio/entities/servicio.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PrestatarioservService', () => {
  let service: PrestatarioservService;
  let prestatarioservRepository: Repository<Prestatarioserv>;
  let prestatarioRepository: Repository<Prestatario>;
  let servicioRepository: Repository<Servicio>;

  const mockPrestatario = {
    id: 'prestatario-1',
    name: 'Test Prestatario',
    isActive: true,
  };

  const mockServicio1 = {
    id: 'servicio-1',
    prestatario: true,
    isActive: true,
  };

  const mockServicio2 = {
    id: 'servicio-2',
    prestatario: true,
    isActive: true,
  };

  const mockPrestatarioServ1 = {
    id: 'ps-1',
    prestatario: mockPrestatario,
    servicio: mockServicio1,
    precio: 100.0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrestatarioServ2 = {
    id: 'ps-2',
    prestatario: mockPrestatario,
    servicio: mockServicio2,
    precio: 200.0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestatarioservService,
        {
          provide: getRepositoryToken(Prestatarioserv),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Prestatario),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Servicio),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PrestatarioservService>(PrestatarioservService);
    prestatarioservRepository = module.get<Repository<Prestatarioserv>>(
      getRepositoryToken(Prestatarioserv),
    );
    prestatarioRepository = module.get<Repository<Prestatario>>(
      getRepositoryToken(Prestatario),
    );
    servicioRepository = module.get<Repository<Servicio>>(
      getRepositoryToken(Servicio),
    );
  });

  describe('create', () => {
    it('debería crear un servicio de prestatario válido', async () => {
      jest
        .spyOn(prestatarioRepository, 'findOne')
        .mockResolvedValue(mockPrestatario as any);
      jest
        .spyOn(servicioRepository, 'findOne')
        .mockResolvedValue(mockServicio1 as any);
      jest
        .spyOn(prestatarioservRepository, 'create')
        .mockReturnValue(mockPrestatarioServ1 as any);
      jest
        .spyOn(prestatarioservRepository, 'save')
        .mockResolvedValue(mockPrestatarioServ1 as any);

      const createDto = {
        prestatario: mockPrestatario.id,
        servicio: mockServicio1.id,
        precio: 100.0,
        descripcion: 'Servicio de transporte',
      };

      const result = await service.create(createDto as any);

      expect(result).toEqual(mockPrestatarioServ1);
      expect(prestatarioservRepository.save).toHaveBeenCalled();
    });

    it('debería fallar si el precio es negativo', async () => {
      jest
        .spyOn(prestatarioRepository, 'findOne')
        .mockResolvedValue(mockPrestatario as any);

      const createDto = {
        prestatario: mockPrestatario.id,
        servicio: mockServicio1.id,
        precio: -10,
      };

      await expect(service.create(createDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería fallar si el prestatario no existe', async () => {
      jest.spyOn(prestatarioRepository, 'findOne').mockResolvedValue(null);

      const createDto = {
        prestatario: 'prestatario-inexistente',
        servicio: mockServicio1.id,
        precio: 100.0,
      };

      await expect(service.create(createDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('calculateTotalPrice', () => {
    it('debería calcular el precio total correctamente (100 + 200 + 5%)', async () => {
      jest.spyOn(prestatarioservRepository, 'find').mockResolvedValue([
        mockPrestatarioServ1,
        mockPrestatarioServ2,
      ] as any);

      const result = await service.calculateTotalPrice(['ps-1', 'ps-2']);

      expect(result.subtotal).toBe(300.0);
      expect(result.comision_porcentaje).toBe(5);
      expect(result.comision_monto).toBe(15.0);
      expect(result.total).toBe(315.0);
    });

    it('debería fallar si no hay servicios proporcionados', async () => {
      await expect(service.calculateTotalPrice([])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería fallar si no encuentra los servicios', async () => {
      jest.spyOn(prestatarioservRepository, 'find').mockResolvedValue([]);

      await expect(service.calculateTotalPrice(['ps-inexistente'])).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByPrestatario', () => {
    it('debería devolver todos los servicios activos de un prestatario', async () => {
      jest.spyOn(prestatarioservRepository, 'find').mockResolvedValue([
        mockPrestatarioServ1,
        mockPrestatarioServ2,
      ] as any);

      const result = await service.findByPrestatario(mockPrestatario.id);

      expect(result).toHaveLength(2);
      expect(prestatarioservRepository.find).toHaveBeenCalled();
    });
  });
});

