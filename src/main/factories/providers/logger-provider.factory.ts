import { ISendErrorLoggerProvider } from '@domain/contracts/providers/logger/send-error-logger.provider';
import { ISendHttpLoggerProvider } from '@domain/contracts/providers/logger/send-http-logger.provider';
import { ISendInfoLoggerProvider } from '@domain/contracts/providers/logger/send-info-logger.provider';

import { WinstonLoggerProvider } from '@infrastructure/providers/logger/winston.logger-provider';

export const makeLoggerProvider = (): ISendErrorLoggerProvider & ISendInfoLoggerProvider & ISendHttpLoggerProvider => {
  return new WinstonLoggerProvider();
};
