import { APP_CONFIG } from './configs/environments.config';
import Framework from './frameworks';

const start = async (): Promise<void> => {
  await Framework.select({
    framework: APP_CONFIG.FRAMEWORK
  });
};
start();
