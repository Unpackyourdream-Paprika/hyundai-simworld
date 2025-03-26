import { TcpModule } from '@modules/tcp/tcp.module';
import { Module } from '@nestjs/common';
import { SimworldController } from './simworld.controller';
import { SimworldService } from './simworld.service';

@Module({
  imports: [TcpModule],
  controllers: [SimworldController],
  providers: [SimworldService],
})
export class SimworldModule {}
