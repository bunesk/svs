import {Request} from 'express-jwt';
import {Response} from 'express';
import User from '../models/User.js';

export const copy = (object: object, entriesToRemove: Array<string> = []) => {
  const copiedObject = JSON.parse(JSON.stringify(object));
  for (const entry of entriesToRemove) {
    delete copiedObject[entry];
  }
  return copiedObject;
};

/**
 * Checks if all the passed parameters exist
 *
 * @param req
 * @param params
 * @returns
 */
export const checkRequiredParams = (req: Request, params: string[]): string | undefined => {
  for (const param of params) {
    if (req.body[param] === undefined) {
      return `Parameter '${param}' is missing.`;
    }
  }
};

export const paramsToObject = (req: Request, params: string[]) => {
  const paramsObject: any = {};
  for (const param of params) {
    paramsObject[param] = req.body[param];
  }
  return paramsObject;
};

export const isAuthenticatedAdmin = async (
  req: Request
): Promise<{status: boolean; message?: string; statusCode?: number}> => {
  if (!req.auth || !req.auth.username) {
    return {status: false, message: 'Authentifizierung fehlgeschlagen.', statusCode: 401};
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return {status: false, message: 'Authentifizierter Benutzer existiert nicht mehr.', statusCode: 404};
  }
  if (!user.isAdmin) {
    return {status: false, message: 'Du bist nicht berechtigt.', statusCode: 403};
  }
  return {status: true};
};

/**
 * Returns a json success response object.
 *
 * @param result request result
 * @param message success message
 * @returns json response object
 */
export const sendJsonSuccess = (res: Response, result: object | object[] = [], message = 'Success') => {
  return res.status(200).json({
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
export const sendJsonError = (res: Response, message = 'An error occured', statusCode = 400) => {
  return res.status(statusCode).json({
    message: message,
    result: [],
  });
};
