import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query } from '@nestjs/common';
import { AggregatedPartService } from './aggregated-part.service';
import { CreateAggregatedPartDto } from './dto/create-aggregated-part.dto';
import { UpdateAggregatedPartDto } from './dto/update-aggregated-part.dto';

@Controller('aggregated-part')
export class AggregatedPartController {
  constructor(private readonly aggregatedPartService: AggregatedPartService) {}

  @Get()
  async findAll(@Query('partNumber') partNumber?: string) {
    const parts = await this.aggregatedPartService.findAll(partNumber || '')
    return parts
  }
}
