import { MongoError } from 'mongodb';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    if (exception instanceof MongoError) {
      switch (exception.code) {
        case 11000:
          status = 400;
          message = 'The user with the given email already exists.';
          break;
        default:
      }
    } else {
      status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      message =
        exception instanceof HttpException
          ? exception.message
          : 'Please try later.';
    }
    console.error(exception);

    response.json({
      status,
      message,
    });
  }
}
