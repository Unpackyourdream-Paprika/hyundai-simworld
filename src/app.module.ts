import { ConnectionService } from '@modules/connection/connection.service';
import { HyundaiModule } from '@modules/hyundai/hyundai.module';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacketHandlerModule } from './modules/packet-handler/packet-handler.module';
import { SimworldModule } from './modules/simworld/simworld.module';
import { SocketModule } from './modules/socket/socket.module';
import { TcpModule } from './modules/tcp/tcp.module';
import { UdpModule } from './modules/udp/udp.module';
import { LoggerMiddleware } from './utils/logger.middleware';
import { CustomerModule } from '@modules/customer/customer.module';
import { CsvModule } from './modules/csv/csv.module';

@Global()
@Module({
  imports: [
    TcpModule,
    SocketModule,
    UdpModule,
    PacketHandlerModule,
    HyundaiModule,
    SimworldModule,
    CustomerModule,
    CsvModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: ConnectionService,
      useValue: new ConnectionService(),
    },
    AppService,
  ],
  exports: [ConnectionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
