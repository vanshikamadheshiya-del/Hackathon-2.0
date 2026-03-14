import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';
import { context, trace } from '@opentelemetry/api';

// Prometheus registry and default metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// HTTP metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 500, 1000, 2000, 5000, 10000],
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestErrorsTotal = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total failed HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestErrorsTotal);

// Auth / user metrics
export const loginSuccessTotal = new client.Counter({
  name: 'auth_login_success_total',
  help: 'Total successful logins',
});

export const loginFailureTotal = new client.Counter({
  name: 'auth_login_failure_total',
  help: 'Total failed logins',
});

export const activeUsersGauge = new client.Gauge({
  name: 'auth_active_users',
  help: 'Approximate number of active users (logged-in sessions)',
});

register.registerMetric(loginSuccessTotal);
register.registerMetric(loginFailureTotal);
register.registerMetric(activeUsersGauge);

// Helper to get trace/span ids for log correlation
const getTraceContext = () => {
  const span = trace.getSpan(context.active());
  if (!span) return {};
  const spanContext = span.spanContext();
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
  };
};

// Very small structured logger to stdout (picked up by Loki via Promtail)
const log = (
  level: 'info' | 'warn' | 'error',
  message: string,
  fields: Record<string, unknown> = {},
) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...getTraceContext(),
    ...fields,
  };
  // Use console methods so Docker logs capture everything
  // eslint-disable-next-line no-console
  (console as any)[level === 'info' ? 'log' : level](JSON.stringify(entry));
};

// Custom request logger + metrics middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  log('info', 'request_started', {
    method: req.method,
    path: req.path,
  });

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = seconds * 1000 + nanoseconds / 1e6;
    const statusCode = res.statusCode;
    const route = (req.route && req.route.path) || req.path;
    const labels = {
      method: req.method,
      route,
      status_code: String(statusCode),
    };

    httpRequestDuration.observe(labels, durationMs);
    httpRequestsTotal.inc(labels);
    if (statusCode >= 400) {
      httpRequestErrorsTotal.inc(labels);
    }

    log(statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info', 'request_finished', {
      method: req.method,
      path: req.path,
      route,
      statusCode,
      durationMs,
    });

    // Flag slow endpoints for log-based analysis
    if (durationMs > 1000) {
      log(durationMs > 5000 ? 'error' : 'warn', 'slow_request', {
        method: req.method,
        path: req.path,
        route,
        durationMs,
      });
    }
  });

  next();
};

// Backwards-compatible performance monitor (now folded into requestLogger)
export const performanceMonitor = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

// Error tracking middleware
export const errorTracker = (err: any, req: Request, res: Response, next: NextFunction) => {
  log('error', 'request_error', {
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    error: err?.message,
    stack: err?.stack,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  next(err);
};

// Express handler for Prometheus /metrics
export const metricsEndpoint = async (_req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};
