import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    const queryString =
      Object.keys(query).length > 0 ? JSON.stringify(query) : 'none';
    const bodyString =
      Object.keys(body).length > 0 ? JSON.stringify(body) : 'none';

    this.loggingService.log(
      `Incoming Request: ${method} ${originalUrl} | Query: ${queryString} | Body: ${bodyString}`,
    );

    const oldSend = res.send;
    const loggingService = this.loggingService;

    res.send = function (data: any) {
      loggingService.log(
        `Response: ${method} ${originalUrl} | Status: ${res.statusCode}`,
      );
      res.send = oldSend;
      return res.send(data);
    };

    next();
  }
}
