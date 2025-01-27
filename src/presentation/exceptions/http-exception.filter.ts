import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  method: string;
  correlationId?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // ساخت پیام خطای استاندارد
    const errorMessage = this.getErrorMessage(exceptionResponse);
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId: request.headers['x-correlation-id'] as string,
      message: errorMessage,
      error: this.getErrorType(status),
    };

    // لاگ کردن خطا
    this.logError(errorResponse, exception);

    // ارسال پاسخ به کلاینت
    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exception: any): string | string[] {
    if (typeof exception === 'string') {
      return exception;
    }

    if (typeof exception.message === 'string') {
      return exception.message;
    }

    if (Array.isArray(exception.message)) {
      return exception.message;
    }

    if (exception.response && exception.response.message) {
      return exception.response.message;
    }

    return 'خطای داخلی سرور';
  }

  private getErrorType(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }

  private logError(
    errorResponse: ErrorResponse,
    exception: HttpException,
  ): void {
    const logMessage = {
      ...errorResponse,
      stack: exception.stack,
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.error(JSON.stringify(logMessage, null, 2));
    } else {
      this.logger.warn(JSON.stringify(logMessage, null, 2));
    }
  }
}
