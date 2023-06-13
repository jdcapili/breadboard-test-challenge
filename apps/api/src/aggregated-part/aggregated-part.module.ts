import { Module } from '@nestjs/common';
import { AggregatedPartService } from './aggregated-part.service';
import { AggregatedPartController } from './aggregated-part.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  controllers: [AggregatedPartController],
  imports: [HttpModule],
  providers: [AggregatedPartService],
  
})
export class AggregatedPartModule {}
