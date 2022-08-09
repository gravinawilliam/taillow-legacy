import readPkg from 'read-pkg';

import { Environment } from '@domain/configs/environment.config';

import {
  getEnvironmentNumber,
  getEnvironmentString
} from '@infrastructure/providers/get-envs/dot-environment.get-environments-provider';

export const GLOBAL_CONFIG = {
  ENVIRONMENT: getEnvironmentString({
    key: 'NODE_ENV',
    defaultValue: 'DEVELOPMENT'
  }) as Environment,
  IS_DEVELOPMENT:
    getEnvironmentString({
      key: 'NODE_ENV',
      defaultValue: 'DEVELOPMENT'
    }) === 'DEVELOPMENT',
  IS_PRODUCTION:
    getEnvironmentString({
      key: 'NODE_ENV',
      defaultValue: 'DEVELOPMENT'
    }) === 'production',
  LOGS_FOLDER: getEnvironmentString({
    key: 'LOGS_FOLDER',
    defaultValue: 'logs'
  })
};

export const DATABASE_CONFIG = {
  DB_TYPE: getEnvironmentString({
    key: 'DB_TYPE',
    defaultValue: 'mysql'
  }),
  DB_HOST: getEnvironmentString({
    key: 'DB_HOST',
    defaultValue: 'localhost'
  }),
  DB_PORT: getEnvironmentNumber({
    key: 'DB_PORT',
    defaultValue: 5306
  }),
  DB_USER: getEnvironmentString({
    key: 'DB_USER',
    defaultValue: 'mars-user'
  }),
  DB_PASSWORD: getEnvironmentString({
    key: 'DB_PASSWORD',
    defaultValue: 'mars-password'
  }),
  DB_NAME: getEnvironmentString({
    key: 'DB_NAME',
    defaultValue: 'base-app'
  })
};

export const APP_INFO = {
  APP_VERSION: getEnvironmentString({
    key: 'APP_VERSION',
    defaultValue: readPkg.sync().version
  }),
  APP_NAME: getEnvironmentString({
    key: 'APP_NAME',
    defaultValue: 'base-app'
  }),
  APP_DESCRIPTION: getEnvironmentString({
    key: 'APP_DESCRIPTION',
    defaultValue: '🚀 To infinity and beyond!'
  }),
  AUTHOR_NAME: getEnvironmentString({
    key: 'AUTHOR_NAME',
    defaultValue: 'William Gravina'
  })
};

export const AWS_CONFIG = {
  SES: {
    ACCESS_KEY_ID: getEnvironmentString({
      key: 'AWS_SES_ACCESS_KEY_ID',
      defaultValue: ''
    }),
    SECRET_ACCESS_KEY: getEnvironmentString({
      key: 'AWS_SES_SECRET_ACCESS_KEY',
      defaultValue: ''
    }),
    REGION: getEnvironmentString({
      key: 'AWS_SES_REGION',
      defaultValue: 'us-east-1'
    })
  }
};

export const KAFKA_CONFIG = {
  BROKER: getEnvironmentString({
    defaultValue: 'localhost:29092',
    key: 'KAFKA_BROKER'
  }),
  CLIENT_ID: getEnvironmentString({
    defaultValue: 'taillow-consumer',
    key: 'KAFKA_CLIENT_ID'
  }),
  TOPIC_REQUEST_TO_SEND_EMAIL: getEnvironmentString({
    defaultValue: 'request-to-send-email',
    key: 'KAFKA_TOPIC_REQUEST_TO_SEND_EMAIL'
  })
};

export const APP_CONFIG = {
  PORT: getEnvironmentNumber({
    key: 'PORT',
    defaultValue: 2222
  }),
  FRAMEWORK: getEnvironmentString({
    key: 'FRAMEWORK',
    defaultValue: 'express'
  }) as 'express' | 'nestjs',
  DOCS_PATH: getEnvironmentString({
    key: 'DOCS_PATH',
    defaultValue: '/docs'
  })
};
