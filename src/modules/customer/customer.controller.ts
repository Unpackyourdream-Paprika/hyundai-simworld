import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAllCustomers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.customerService.getAllCustomers(page, limit);
    return {
      success: true,
      message: '',
      data: result,
    };
  }

  @Get('/:param')
  async getCustomerByIdOrName(
    @Param('param') param: number | string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    let result;
    if (isNaN(Number(param))) {
      result = await this.customerService.getCustomersByNameWithPage(
        param as string,
        page,
        limit,
      );
      return {
        success: true,
        message: '',
        data: result,
      };
    } else {
      result = await this.customerService.getCustomerById(Number(param));
      return {
        success: true,
        message: '',
        data: {
          customer: result,
        },
      };
    }
  }

  @Post()
  async createCustomers(@Body() customerDto: CustomerDto) {
    const result = await this.customerService.createCustomer(customerDto);
    if (result > 0) {
      return {
        success: true,
        message: '',
      };
    } else if (result == -1) {
      return {
        success: false,
        message: 'Invalid DTO',
      };
    } else if (result == -2) {
      return {
        success: false,
        message: 'Internal server error.',
      };
    }
  }
}
