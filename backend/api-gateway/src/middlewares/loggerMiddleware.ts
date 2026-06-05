import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@frella/shared';

const logger = createLogger('api-gateway');

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error'
                : res.statusCode >= 400 ? 'warn'
                : 'info';
    logger[level]('HTTP request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
    });
  });
  next();
};

export { logger };