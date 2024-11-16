import { HttpContext } from '@adonisjs/core/http';
import { IResponseError, StatusCodeEnum } from '#types/response';

export default class ResponseErrorHandler {
  handleError(response: HttpContext['response'], statusCode: StatusCodeEnum, error?: unknown) {
    if (error instanceof Error) {
      const errorResponse: IResponseError = { errors: [{ message: error.message }] };
      return response[statusCode](errorResponse);
    }
    return response[statusCode](error);
  }
}
