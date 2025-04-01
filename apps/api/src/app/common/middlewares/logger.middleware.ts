import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, body, query, params } = req;
        
        this.logger.log(`➡️  ${method} ${originalUrl}`);
        this.logger.debug(`Body: ${JSON.stringify(body)}`);
        this.logger.debug(`Query: ${JSON.stringify(query)}`);
        this.logger.debug(`Params: ${JSON.stringify(params)}`);

        res.on('finish', () => {
            this.logger.log(`⬅️  Response ${res.statusCode} ${method} ${originalUrl}`);
        });

        next();
    }
}