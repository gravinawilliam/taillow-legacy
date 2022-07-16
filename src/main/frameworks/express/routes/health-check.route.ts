import { Request, Response, Router } from 'express';

import { HttpStatusCode } from '@shared/utils/http-status-code.util';

const healthCheckRouter = Router();

// eslint-disable-next-line @typescript-eslint/naming-convention
healthCheckRouter.get('/', (_request: Request, response: Response) => {
  response.status(HttpStatusCode.OK).json({
    message: '🚀 To infinity and beyond!'
  });
});

export default healthCheckRouter;
