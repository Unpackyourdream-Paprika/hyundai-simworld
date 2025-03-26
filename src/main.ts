import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception/global-exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // app.setGlobalPrefix('api');

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

  await app.listen(process.env.PORT ?? 4001);
  console.log(
    `✅ Application is running on: http://localhost:${process.env.PORT ?? 4001} 🚀`,
  );
}
bootstrap();
