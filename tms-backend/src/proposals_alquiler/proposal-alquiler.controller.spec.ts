import { Test, TestingModule } from '@nestjs/testing';
import { PrestatarioController } from './prestatario.controller';
import { PrestatarioService } from './prestatario.service';

describe('PrestatarioController', () => {
  let controller: PrestatarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestatarioController],
      providers: [PrestatarioService],
    }).compile();

    controller = module.get<PrestatarioController>(PrestatarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
