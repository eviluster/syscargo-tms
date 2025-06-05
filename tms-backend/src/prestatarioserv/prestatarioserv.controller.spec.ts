import { Test, TestingModule } from '@nestjs/testing';
import { PrestatarioservController } from './prestatarioserv.controller';
import { PrestatarioservService } from './prestatarioserv.service';

describe('PrestatarioservController', () => {
  let controller: PrestatarioservController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestatarioservController],
      providers: [PrestatarioservService],
    }).compile();

    controller = module.get<PrestatarioservController>(PrestatarioservController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
