import { Response } from 'express';
import { MongoError } from 'mongodb';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorRes } from 'types/error/error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let code: number;
    let message: string;

    if (exception instanceof MongoError) {
      switch (exception.code) {
        case 11000:
          code = 409;
          message = 'The user with the given email already exists.';
          break;
        default:
      }
    } else {
      code =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      message =
        exception instanceof HttpException
          ? exception.message
          : 'Please try later.';
    }
    console.error(exception);
    const errRes: ErrorRes = { code, message };
    response.status(code).json(errRes);
  }
}
