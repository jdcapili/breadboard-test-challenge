import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query } from '@nestjs/common';
import { AggregatedPartService } from './aggregated-part.service';
import { CreateAggregatedPartDto } from './dto/create-aggregated-part.dto';
import { UpdateAggregatedPartDto } from './dto/update-aggregated-part.dto';

@Controller('aggregated-part')
export class AggregatedPartController {
  constructor(private readonly aggregatedPartService: AggregatedPartService) {}

  // @Post()
  // create(@Body() createAggregatedPartDto: CreateAggregatedPartDto) {
  //   return this.aggregatedPartService.create(createAggregatedPartDto);
  // }

  @Get()
  @Render('aggregated-part')
  async findAll(@Query('partNumber') partNumber?: string) {
    const parts = await this.aggregatedPartService.findAll(partNumber || '')
    // return JSON.stringify(parts, null, 4);
    return {test: JSON.stringify(parts, null, 7)}
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.aggregatedPartService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAggregatedPartDto: UpdateAggregatedPartDto) {
  //   return this.aggregatedPartService.update(+id, updateAggregatedPartDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.aggregatedPartService.remove(+id);
  // }
}
