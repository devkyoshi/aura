// export interface IResponse<T = null> {
//     data: T | null; // `data` can be any type or null (e.g., in case of errors).
//     message: string; // A message describing the result of the request.
//     success: boolean; // Whether the request was successful.
// }

import { Request } from 'express';

export interface CustomRequest<T = null> extends Request {
  user?: { id?: string; role?: string };
  body: T;
}
