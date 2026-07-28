import pino from 'pino';

export const logger = pino({
  // Enforce info log level in production, debug in local development
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,

  formatters: {
    level: (label: string) => ({ level: label }),
  },

  serializers: {
    error: pino.stdSerializers.err, 
  },

  // Required fallback to safely stream logs if executed on Next.js client-side/browser
  browser: {
    asObject: true,
  },
});
