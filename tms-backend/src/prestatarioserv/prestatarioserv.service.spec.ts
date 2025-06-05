import { Test, TestingModule } from '@nestjs/testing';
import { PrestatarioservService } from './prestatarioserv.service';

describe('PrestatarioservService', () => {
  let service: PrestatarioservService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrestatarioservService],
    }).compile();

    service = module.get<PrestatarioservService>(PrestatarioservService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
