import { Test, TestingModule } from '@nestjs/testing';
import { TipotransporteController } from './tipotransporte.controller';
import { TipotransporteService } from './tipotransporte.service';

describe('TipotransporteController', () => {
  let controller: TipotransporteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipotransporteController],
      providers: [TipotransporteService],
    }).compile();

    controller = module.get<TipotransporteController>(TipotransporteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
