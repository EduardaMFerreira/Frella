import {
  handleAll,
  retry,
  circuitBreaker,
  timeout,
  wrap,
  ExponentialBackoff,
  ConsecutiveBreaker,
  TimeoutStrategy,
} from 'cockatiel';
import { logger } from '../logger';

export const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff({ initialDelay: 200, maxDelay: 5000 }),
});

export const circuitBreakerPolicy = circuitBreaker(handleAll, {
  halfOpenAfter: 10_000,
  breaker: new ConsecutiveBreaker(5),
});

export const timeoutPolicy = timeout(5_000, TimeoutStrategy.Aggressive);

export const resilientPolicy = wrap(timeoutPolicy, retryPolicy, circuitBreakerPolicy);

retryPolicy.onRetry((reason: any) =>
  logger.warn('[Resilience] Retentativa após falha', {
    error: reason.error?.message,
  })
);

circuitBreakerPolicy.onBreak((reason: any) =>
  logger.error('[Resilience] Circuit Breaker ABERTO', {
    error: reason.error?.message,
  })
);

circuitBreakerPolicy.onReset(() =>
  logger.info('[Resilience] Circuit Breaker FECHADO — sistema recuperado')
);

circuitBreakerPolicy.onHalfOpen(() =>
  logger.info('[Resilience] Circuit Breaker SEMI-ABERTO — testando...')
);