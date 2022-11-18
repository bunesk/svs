import {Request, Response} from 'express';

/**
 * Checks if all the passed parameters exist
 *
 * @param req
 * @param params
 * @returns
 */
export const checkRequiredParams = (req: Request, params: string[]): string | undefined => {
  for (const param of params) {
    if (req.params[param] === undefined) {
      return `Parameter '${param}' is missing.`;
    }
  }
};

export const paramsToObject = (req: Request, params: string[]) => {
  const paramsObject: any = {};
  for (const param of params) {
    paramsObject[param] = req.params[param];
  }
  return paramsObject;
};

/**
 * Returns a json success response object.
 *
 * @param result request result
 * @param message success message
 * @returns json response object
 */
export const sendJsonSuccess = (res: Response, result: object | Array<object> = [], message = 'Success') => {
  return res.json({
    status: true,
    message: message,
    result: result,
  });
};

/**
 * Returns a json error response object.
 *
 * @param message error message
 * @returns json response object
 */
export const sendJsonError = (res: Response, message = 'An error occured') => {
  return res.json({
    status: false,
    message: message,
    result: [],
  });
};
