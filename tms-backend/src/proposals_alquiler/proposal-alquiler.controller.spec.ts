import { Test, TestingModule } from '@nestjs/testing';
import { ProposalsAlquilerController } from './proposal-alquiler.controller';
import { ProposalsAlquilerService } from './proposal-alquiler.service';

describe('ProposalsAlquilerController', () => {
  let controller: ProposalsAlquilerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProposalsAlquilerController],
      providers: [ProposalsAlquilerService],
    }).compile();

    controller = module.get<ProposalsAlquilerController>(ProposalsAlquilerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
