import {Request, Response} from 'express';
import User from '../models/User.js';
import {checkRequiredParams, paramsToObject, sendJsonError, sendJsonSuccess} from '../server/json.js';

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
    return sendJsonSuccess(res, [], 'Benutzer erfolgreich angelegt.');
  } catch (e: any) {
    return sendJsonError(res, `Benutzer anlegen fehlgeschlagen: ${e.message}`);
  }
};

export const login = async (req: Request, res: Response) => {
  const requiredParams = ['username', 'password'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const params = paramsToObject(req, requiredParams);
  const user = User.findOne({where: params});
  if (!user) {
    return sendJsonError(res, 'Benutzername oder Password falsch.');
  }
  return sendJsonSuccess(res, user);
};
