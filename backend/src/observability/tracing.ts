import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// @ts-ignore: Could not find a declaration file for external module
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const traceExporter = new OTLPTraceExporter({
  // Tempo OTLP HTTP receiver (configured in tempo-config.yml)
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://tempo:4318/v1/traces',
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'backend',
  }),
  traceExporter,
  instrumentations: getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-express': {},
    '@opentelemetry/instrumentation-http': {},
    '@opentelemetry/instrumentation-mongoose': {},
  }),
});

// NodeSDK.start is synchronous in this version
sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
});

export default sdk;

