import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch()
export class ServerErrorExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * @description Exception json response
     * @param message
     */
    const responseMessage = (type: string, message: string) => {
      if (message.indexOf('Passwords are not the same') >= 0) {
        status = 400;
        message = 'Passwords are not the same';
      }
      response.status(status).json({
        status,
        message,
      });
    };

    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    if (exception.message) {
      responseMessage('Error', exception.message);
    } else {
      responseMessage(exception.name, exception.message);
    }
  }
}
