import { Test, TestingModule } from '@nestjs/testing';
import { TipomercadoService } from './tipomercado.service';

describe('TipomercadoService', () => {
  let service: TipomercadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipomercadoService],
    }).compile();

    service = module.get<TipomercadoService>(TipomercadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
