export interface IResponseError {
  errors: Array<{ message: string }>;
}

export enum StatusCodeEnum {
  BadRequest = 'badRequest',
  Forbidden = 'forbidden',
  NotFound = 'notFound',
  Conflict = 'conflict',
  Unauthorized = 'unauthorized',
}
