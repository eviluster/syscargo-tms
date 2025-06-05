import { Test, TestingModule } from '@nestjs/testing';
import { CargaController } from './carga.controller';
import { CargaService } from './carga.service';

describe('CargaController', () => {
  let controller: CargaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CargaController],
      providers: [CargaService],
    }).compile();

    controller = module.get<CargaController>(CargaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
