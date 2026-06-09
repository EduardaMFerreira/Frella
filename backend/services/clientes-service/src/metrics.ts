import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

const SERVICE_NAME = 'clientes-service';

export const register = new Registry();
register.setDefaultLabels({ service: SERVICE_NAME });
collectDefaultMetrics({ register });

export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});