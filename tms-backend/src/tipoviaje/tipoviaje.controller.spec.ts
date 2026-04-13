import { Test, TestingModule } from '@nestjs/testing';
import { TipoviajeController } from './tipoviaje.controller';
import { TipoviajeService } from './tipoviaje.service';

describe('TipoviajeController', () => {
  let controller: TipoviajeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoviajeController],
      providers: [TipoviajeService],
    }).compile();

    controller = module.get<TipoviajeController>(TipoviajeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
