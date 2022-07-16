/* eslint-disable @typescript-eslint/naming-convention */
import { RequestHandler } from 'express';
import emoji from 'node-emoji';

import { HttpStatusCode } from '@shared/utils/http-status-code.util';

import { APP_INFO } from '@main/configs/environments.config';

type Adapter = () => RequestHandler;

// eslint-disable-next-line unused-imports/no-unused-vars
export const notFoundRouteMiddleware: Adapter = () => async (request, response, _next) => {
  if (!response.headersSent) {
    const error = {
      code: 'not_found',
      message: `${emoji.get('cry')} Can't find ${request.method.toUpperCase()} ${request.originalUrl} on this server.`,
      status: HttpStatusCode.NOT_FOUND,
      appVersion: APP_INFO.APP_VERSION
    };
    response.status(error.status).send(error);
  }
  response.end();
};
