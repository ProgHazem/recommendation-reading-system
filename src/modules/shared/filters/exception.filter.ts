import { IResponse } from '@App/modules/shared/utils/response-interface';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Catch()
export class CustomExceptionFilter<T extends Error> implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(CustomExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    this.logger.error({
      request: { ...request },
      response: { ...response },
      exception: { ...exception },
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(<IResponse<string>>{
      errors: { ...exception },
      message: exception.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
