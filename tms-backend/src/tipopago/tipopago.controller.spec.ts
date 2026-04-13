import { Test, TestingModule } from '@nestjs/testing';
import { TipopagoController } from './tipopago.controller';
import { TipopagoService } from './tipopago.service';

describe('TipopagoController', () => {
  let controller: TipopagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipopagoController],
      providers: [TipopagoService],
    }).compile();

    controller = module.get<TipopagoController>(TipopagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
