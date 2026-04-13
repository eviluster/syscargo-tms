import { Test, TestingModule } from '@nestjs/testing';
import { TipotransporteService } from './tipotransporte.service';

describe('TipotransporteService', () => {
  let service: TipotransporteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipotransporteService],
    }).compile();

    service = module.get<TipotransporteService>(TipotransporteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
