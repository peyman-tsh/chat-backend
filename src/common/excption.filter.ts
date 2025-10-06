import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const type=host.getType()
    const ctx = host.switchToHttp();

    if (type === 'http') {
      const response = ctx.getResponse<Response>();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';

      if (exception instanceof MongooseError.ValidationError) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Validation failed';
        const errors = Object.keys(exception.errors).map((key) => ({
          field: key,
          error: exception.errors[key].message,
        }));
        return response.status(status).json({ statusCode: status, error: 'Bad Request', message, details: errors });
      }

      if (exception instanceof MongooseError.CastError) {
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid value for ${exception.path}`;
        return response.status(status).json({ statusCode: status, error: 'Bad Request', message, invalidValue: exception.value });
      }

      if (exception?.code === 11000) {
        status = HttpStatus.CONFLICT;
        const duplicateFields = Object.keys(exception.keyValue);
        message = `Duplicate value for: ${duplicateFields.join(', ')}`;
        return response.status(status).json({ statusCode: status, error: 'Conflict', message, duplicateFields });
      }

      if (exception.name === 'DocumentNotFoundError') {
        status = HttpStatus.NOT_FOUND;
        message = 'Document not found';
        return response.status(status).json({ statusCode: status, error: 'Not Found', message });
      }

      return response.status(status).json({ statusCode: status, error: 'Internal Server Error', message: exception.message || message });
    }
  }
}