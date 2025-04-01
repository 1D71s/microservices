import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RMQError } from 'nestjs-rmq';

@Catch(RMQError)
export class RMQExceptionFilter implements ExceptionFilter {
    catch(exception: RMQError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = Number(exception.code) || HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            statusCode: status,
            message: exception.message,
            error: HttpStatus[status] || 'Internal Server Error',
        });
    }
}
