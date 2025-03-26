import { ConnectionService } from '@modules/connection/connection.service';

import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SimworldModule } from './modules/simworld/simworld.module';

import { LoggerMiddleware } from './utils/logger.middleware';
import { CustomerModule } from '@modules/customer/customer.module';

@Global()
@Module({
  imports: [SimworldModule, CustomerModule],
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
