import { Request, Response } from 'express';

import { HttpRequest } from '@shared/types/http-request.type';
import { HttpResponse } from '@shared/types/http-response.type';
import { HttpStatusCode } from '@shared/utils/http-status-code.util';

interface IController {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const adapterRoute = (controller: IController) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: request.params,
      headers: request.headers,
      query: request.query
    };

    const { data, statusCode } = await controller.handle(httpRequest);
    if (statusCode >= HttpStatusCode.OK && statusCode <= 399) {
      response.status(statusCode).json(data);
    } else {
      response.status(statusCode).json({
        error: data.message
      });
    }
  };
};
