import { SocketService } from '@modules/socket/socket.service';
import { UdpService } from '@modules/udp/udp.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception/global-exception.filter';
import { TcpService } from './modules/tcp/tcp.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new GlobalExceptionFilter());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     forbidUnknownValues: true,
  //   }),
  // );

  app.enableCors({
    origin: [
      'http://192.168.10.101:3000',
      // 'http://192.168.10.123',
      'http://localhost:3000',
      'https://hyundai-sim-world.web.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Socket.IO 초기화
  const httpServer = app.getHttpServer();
  const socketService = app.get(SocketService);
  try {
    socketService.initializeSocket(httpServer);
    console.log('Socket.IO initialized successfully');
  } catch (err) {
    console.error('Error initializing Socket.IO:', err);
  }

  // Start udp server
  try {
    const udpService = app.get(UdpService);
    udpService.startServer(
      process.env.UDP_SERVER_HOST,
      Number(process.env.UDP_SERVER_PORT),
    );
  } catch (error) {
    console.log(
      `❌ Connect UDP listening on Server ${process.env.UDP_SERVER_HOST}:${Number(process.env.UDP_SERVER_PORT)} Error: ${error}`,
    );
  }

  // Start udp client
  // try {
  //   this.udpService.listenForMessages();
  //   console.log(`✅ Success OnModuleInit UDP Server to Listen`);
  // } catch (error) {
  //   console.log(`❌ Listen UDP Server Error: ${error}`);
  // }

  // Start tcp Server
  try {
    const tcpService = app.get(TcpService);
    tcpService.startServer(
      process.env.TCP_SERVER_HOST,
      Number(process.env.TCP_SERVER_PORT),
    );
  } catch (error) {
    console.log(
      `❌ Connect TCP listening on Server ${process.env.TCP_SERVER_HOST}:${Number(process.env.TCP_SERVER_PORT)} Error: ${error}`,
    );
  }

  await app.listen(process.env.PORT ?? 4000);
  console.log(`✅ Application is running on: http://localhost:${process.env.PORT ?? 4000} 🚀`);
}
bootstrap();
