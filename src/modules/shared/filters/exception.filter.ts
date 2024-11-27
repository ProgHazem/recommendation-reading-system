import { IResponse } from '@App/modules/shared/interfaces/response.interface';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Catch()
export class CustomExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  constructor(
    @InjectPinoLogger(CustomExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status = exception?.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error({
      request: { ...request },
      response: { ...response },
      exception: { ...exception },
    });

    response.status(status).send(<IResponse<string>>{
      error: exception.name,
      message: exception.message,
      statusCode: status,
      statusMessage: 'failed',
    });
  }
}
