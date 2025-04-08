import type { Params } from 'nestjs-pino';
import { Request, Response } from 'express';

export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
    serializers: {
      req: (req: Request) => ({
        method: req.method,
        url: req.url,
        headers: req.headers,
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },
  },
};
