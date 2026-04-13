import { Test, TestingModule } from '@nestjs/testing';
import { PlanServicioPrestatarioService } from './plan-servicio-prestatario.service';

describe('PlanServicioPrestatarioService', () => {
  let service: PlanServicioPrestatarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanServicioPrestatarioService],
    }).compile();

    service = module.get<PlanServicioPrestatarioService>(PlanServicioPrestatarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
