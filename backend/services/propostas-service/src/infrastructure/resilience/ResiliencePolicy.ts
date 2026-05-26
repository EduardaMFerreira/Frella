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

// ── Retry com backoff exponencial ───────────────────────────────────────
export const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff({ initialDelay: 200, maxDelay: 5000 }),
});

// ── Circuit Breaker — abre após 5 falhas consecutivas ───────────────────
export const circuitBreakerPolicy = circuitBreaker(handleAll, {
  halfOpenAfter: 10_000,
  breaker: new ConsecutiveBreaker(5),
});

// ── Timeout — cancela chamadas que demoram mais de 5s ───────────────────
export const timeoutPolicy = timeout(5_000, TimeoutStrategy.Aggressive);

// ── Política combinada ──────────────────────────────────────────────────
export const resilientPolicy = wrap(timeoutPolicy, retryPolicy, circuitBreakerPolicy);

// ── Eventos de log ──────────────────────────────────────────────────────
retryPolicy.onRetry((reason) =>
  console.warn('[Resilience] Retentativa após falha:', (reason as any).error?.message)
);

circuitBreakerPolicy.onBreak((reason) =>
  console.error('[Resilience] Circuit Breaker ABERTO:', (reason as any).error?.message)
);

circuitBreakerPolicy.onReset(() =>
  console.log('[Resilience] Circuit Breaker FECHADO — sistema recuperado')
);

circuitBreakerPolicy.onHalfOpen(() =>
  console.log('[Resilience] Circuit Breaker SEMI-ABERTO — testando...')
);