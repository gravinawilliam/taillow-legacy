/**
 * Health check to verify if the service is alive.
 */

import * as http from 'http';

import { APP_CONFIG } from './configs/environments.config';

const options = {
  host: 'localhost',
  port: APP_CONFIG.PORT,
  timeout: 2000,
  path: `/health-check`
};

const request = http.request(options, (parameters: http.IncomingMessage) => {
  process.exitCode = parameters.statusCode === 200 ? 0 : 1;
  process.exit();
});

request.on('error', () => {
  process.exit(1);
});

request.end();
