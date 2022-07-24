import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let status = exception.getStatus();
    if (status === 404) {
      status = 401;
      exception.message = 'Credentials are not valid.';
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(status).json({
      status,
      message: exception.message,
    });
  }
}
