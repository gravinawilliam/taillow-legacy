import gracefulShutdown from 'http-graceful-shutdown';

import { ISendInfoLoggerProvider } from '@domain/contracts/providers/logger/send-info-logger.provider';

import { makeLoggerProvider } from '@main/factories/providers/logger-provider.factory';

import { ExpressFramework } from './express/app';

namespace SelectFrameworkDTO {
  export type Parameters = {
    framework: 'express' | 'nestjs';
  };
  export type Return = Promise<any>;
}

class Framework {
  private readonly logger: ISendInfoLoggerProvider;

  constructor() {
    this.logger = makeLoggerProvider();
  }

  public async select(parameters: SelectFrameworkDTO.Parameters): SelectFrameworkDTO.Return {
    if (parameters.framework === 'express') {
      return this.initializeExpress();
    } else {
      await this.initializeExpress();
    }
  }

  private async initializeExpress(): Promise<void> {
    const express = new ExpressFramework();
    const server = await express.execute();

    gracefulShutdown(server, {
      finally: () => {
        this.logger.info({
          message: 'Shutting down...'
        });
      }
    });
  }
}

export default new Framework();
