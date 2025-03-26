import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { saveLogger } from 'src/utils/custom-logger';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse() as
      | string
      | { message: string | string[]; error: string };

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message;

    const error =
      typeof exceptionResponse === 'string' ? null : exceptionResponse['error'];

    console.log(exception);
    saveLogger.error(`[${status}] ${message}\n`);

    // response.status(status).json({
    //   success: false,
    //   message: Array.isArray(message) ? message.join(', ') : message,
    //   error,
    //   statusCode: status,
    // });

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
