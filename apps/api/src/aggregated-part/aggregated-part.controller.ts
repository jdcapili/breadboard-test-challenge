import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query } from '@nestjs/common';
import { AggregatedPartService } from './aggregated-part.service';

@Controller('aggregated-part')
export class AggregatedPartController {
  constructor(private readonly aggregatedPartService: AggregatedPartService) {}

  @Get()
  async findAll(@Query('partNumber') partNumber?: string) {
    const parts = await this.aggregatedPartService.findAll(partNumber || '')
    return parts
  }
}
