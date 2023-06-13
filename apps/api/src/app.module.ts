import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AggregatedPartModule } from './aggregated-part/aggregated-part.module';

@Module({
  imports: [AggregatedPartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
