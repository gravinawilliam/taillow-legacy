import { performance } from 'perf_hooks';

import { makeLoggerProvider } from '@main/factories/providers/logger-provider.factory';

import { prisma } from './database/prisma/prisma';

type BootstrapResult = {
  bootstrapDuration: number;
};

export const bootstrap = async (): Promise<BootstrapResult> => {
  const bootstrapStartTime = performance.now();
  const logger = makeLoggerProvider();

  logger.info({ message: 'Bootstrapping infrastructure...' });

  logger.info({ message: 'Initializing prisma...' });
  await prisma.$connect();
  logger.info({ message: 'prisma initialized!' });

  const bootstrapEndTime = performance.now();
  const bootstrapDuration = Math.floor(bootstrapEndTime - bootstrapStartTime);

  logger.info({ message: `Infrastructure bootstrap took ${bootstrapDuration} ms!` });

  return { bootstrapDuration };
};
