import { Module } from '@nestjs/common';
import { SimworldController } from './simworld.controller';
import { SimworldService } from './simworld.service';

@Module({
  controllers: [SimworldController],
  providers: [SimworldService],
})
export class SimworldModule {}
