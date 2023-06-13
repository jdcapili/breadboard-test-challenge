import { Test, TestingModule } from '@nestjs/testing';
import { AggregatedPartController } from './aggregated-part.controller';
import { AggregatedPartService } from './aggregated-part.service';

describe('AggregatedPartController', () => {
  let controller: AggregatedPartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AggregatedPartController],
      providers: [AggregatedPartService],
    }).compile();

    controller = module.get<AggregatedPartController>(AggregatedPartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
