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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    const error = 'Unauthorized';

    if (exception.message === 'Document not found.') {
      exception.message = 'Credentials are not valid.';
      status = 401;
    }

    response.status(status).json({
      status,
      message: exception.message,
      error,
    });
  }
}
