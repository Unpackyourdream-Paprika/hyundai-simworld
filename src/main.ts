import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception/global-exception.filter';

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

  await app.listen(process.env.PORT ?? 4000);
  console.log(
    `✅ Application is running on: http://localhost:${process.env.PORT ?? 4000} 🚀`,
  );
}
bootstrap();
