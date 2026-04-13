import { Test, TestingModule } from '@nestjs/testing';
import { TipomercadoController } from './tipomercado.controller';
import { TipomercadoService } from './tipomercado.service';

describe('TipomercadoController', () => {
  let controller: TipomercadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipomercadoController],
      providers: [TipomercadoService],
    }).compile();

    controller = module.get<TipomercadoController>(TipomercadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
