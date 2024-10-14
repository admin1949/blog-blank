import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import type { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class NotauthFilter<UnauthorizedException> implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 401;

    response.status(200).json({
      code: status,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      path: request.url,
      message: 'Unauthorized',
    });
  }
}
