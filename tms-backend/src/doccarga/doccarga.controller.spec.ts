import { Test, TestingModule } from '@nestjs/testing';
import { DoccargaController } from './doccarga.controller';
import { DoccargaService } from './doccarga.service';

describe('DoccargaController', () => {
  let controller: DoccargaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoccargaController],
      providers: [DoccargaService],
    }).compile();

    controller = module.get<DoccargaController>(DoccargaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
