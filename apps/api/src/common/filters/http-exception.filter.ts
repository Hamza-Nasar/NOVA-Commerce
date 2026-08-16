import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { id?: string }>();
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const detail = isHttp ? exception.getResponse() : undefined;
    const message = typeof detail === 'object' && detail && 'message' in detail
      ? (detail as { message: string | string[] }).message
      : isHttp ? exception.message : 'Internal server error';
    if (!isHttp) {
      this.logger.error(
        exception instanceof Error ? exception.message : String(exception),
        exception instanceof Error ? exception.stack : undefined,
      );
    }
    response.status(status).json({
      success: false,
      error: { statusCode: status, message, code: isHttp ? undefined : 'INTERNAL_ERROR' },
      meta: { timestamp: new Date().toISOString(), path: request.url, requestId: request.id },
    });
  }
}
