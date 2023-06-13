import { Test, TestingModule } from '@nestjs/testing';
import { AggregatedPartService } from './aggregated-part.service';

describe('AggregatedPartService', () => {
  let service: AggregatedPartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AggregatedPartService],
    }).compile();

    service = module.get<AggregatedPartService>(AggregatedPartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
