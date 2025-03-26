import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new HttpException("error", HttpStatus.INTERNAL_SERVER_ERROR);
    return this.appService.getHello();
  }
}
