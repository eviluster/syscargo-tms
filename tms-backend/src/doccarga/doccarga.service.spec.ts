import { Test, TestingModule } from '@nestjs/testing';
import { DoccargaService } from './doccarga.service';

describe('DoccargaService', () => {
  let service: DoccargaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoccargaService],
    }).compile();

    service = module.get<DoccargaService>(DoccargaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
