import {Request, Response} from 'express';
import User from '../models/User.js';
import {checkRequiredParams, paramsToObject, sendJsonError, sendJsonSuccess} from '../server/json.js';

import * as dotenv from 'dotenv';
import {createJwtToken} from '../server/auth.js';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const index = (req: Request, res: Response) => {
  return getAll(req, res);
};

export const getName = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.params.id} nicht gefunden.`);
  }
  return res.json({
    status: true,
    result: {name: user.getFullName()},
  });
};

export const getAll = async (req: Request, res: Response) => {
  const users = await User.findAll({paranoid: !req.params.includeInactive});
  return sendJsonSuccess(res, users);
};

export const register = async (req: Request, res: Response) => {
  const requiredParams = ['username', 'firstName', 'lastName', 'gender', 'matriculationNumber', 'email', 'password'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  try {
    const params = paramsToObject(req, requiredParams);
    await User.create(params);
    const jwtToken = createJwtToken(req.params.username);
    return sendJsonSuccess(res, {jwtToken: jwtToken}, 'Benutzer erfolgreich angelegt.');
  } catch (e: any) {
    let message = 'Benutzer anlegen fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.';
    if (e.parent.code === 'ER_DUP_ENTRY') {
      message = 'Benutzername bereits vergeben. Bitte wählen Sie einen anderen.';
    }
    return sendJsonError(res, message);
  }
};

export const login = async (req: Request, res: Response) => {
  const requiredParams = ['username', 'password'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const params = paramsToObject(req, requiredParams);
  const user = await User.findOne({where: params});
  if (!user) {
    return sendJsonError(res, 'Benutzername oder Password falsch.');
  }
  const jwtToken = createJwtToken(req.params.username);
  return sendJsonSuccess(res, {jwtToken: jwtToken});
};
