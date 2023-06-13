import { PartialType } from '@nestjs/mapped-types';
import { CreateAggregatedPartDto } from './create-aggregated-part.dto';

export class UpdateAggregatedPartDto extends PartialType(CreateAggregatedPartDto) {}
