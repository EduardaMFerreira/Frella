"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resilientPolicy = exports.timeoutPolicy = exports.circuitBreakerPolicy = exports.retryPolicy = void 0;
const cockatiel_1 = require("cockatiel");
const logger_1 = require("../logger");
exports.retryPolicy = (0, cockatiel_1.retry)(cockatiel_1.handleAll, {
    maxAttempts: 3,
    backoff: new cockatiel_1.ExponentialBackoff({ initialDelay: 200, maxDelay: 5000 }),
});
exports.circuitBreakerPolicy = (0, cockatiel_1.circuitBreaker)(cockatiel_1.handleAll, {
    halfOpenAfter: 10000,
    breaker: new cockatiel_1.ConsecutiveBreaker(5),
});
exports.timeoutPolicy = (0, cockatiel_1.timeout)(5000, cockatiel_1.TimeoutStrategy.Aggressive);
exports.resilientPolicy = (0, cockatiel_1.wrap)(exports.timeoutPolicy, exports.retryPolicy, exports.circuitBreakerPolicy);
exports.retryPolicy.onRetry((reason) => logger_1.logger.warn('[Resilience] Retentativa após falha', {
    error: reason.error?.message,
}));
exports.circuitBreakerPolicy.onBreak((reason) => logger_1.logger.error('[Resilience] Circuit Breaker ABERTO', {
    error: reason.error?.message,
}));
exports.circuitBreakerPolicy.onReset(() => logger_1.logger.info('[Resilience] Circuit Breaker FECHADO — sistema recuperado'));
exports.circuitBreakerPolicy.onHalfOpen(() => logger_1.logger.info('[Resilience] Circuit Breaker SEMI-ABERTO — testando...'));
