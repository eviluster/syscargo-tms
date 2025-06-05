import { Test, TestingModule } from '@nestjs/testing';
import { TipoviajeService } from './tipoviaje.service';

describe('TipoviajeService', () => {
  let service: TipoviajeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoviajeService],
    }).compile();

    service = module.get<TipoviajeService>(TipoviajeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
