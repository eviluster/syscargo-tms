import { Test, TestingModule } from '@nestjs/testing';
import { ProposalsServicesController } from './proposal-service.controller';
import { ProposalsServicesService } from './proposal-service.service';

describe('ProposalsServicesController', () => {
  let controller: ProposalsServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProposalsServicesController],
      providers: [ProposalsServicesService],
    }).compile();

    controller = module.get<ProposalsServicesController>(ProposalsServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
