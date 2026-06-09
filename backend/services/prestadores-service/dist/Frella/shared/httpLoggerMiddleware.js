"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLoggerMiddleware = httpLoggerMiddleware;
function httpLoggerMiddleware(logger) {
    return (req, res, next) => {
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
                correlationId: req.correlationId,
            });
        });
        next();
    };
}
