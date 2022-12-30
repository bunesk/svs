import {Request} from 'express-jwt';
import {Response} from 'express';
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
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  const user = await User.findByPk(req.body.id);
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.id} nicht gefunden.`);
  }
  return res.json({
    status: true,
    result: {name: user.getFullName()},
  });
};

export const getAll = async (req: Request, res: Response) => {
  const users = await User.findAll({paranoid: !req.body.includeInactive});
  return sendJsonSuccess(res, users);
};

// export const getData = async (req: Request, res: Response) => {
//   if (!req.body.id) {
//     return sendJsonError(res, 'Benutzer-ID fehlt');
//   }
//   const user = await User.findOne({paranoid: !req.body.includeInactive});
//   if (!user) {
//     return sendJsonError(res, `Benutzer mit der ID ${req.body.id} nicht gefunden.`);
//   }
//   return sendJsonSuccess(res, user);
// };

export const getData = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return sendJsonError(res, `Benutzer '${req.auth.username}' nicht gefunden.`, 404);
  }
  return sendJsonSuccess(res, user);
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
    const jwtToken = createJwtToken(req.body.username);
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
  const jwtToken = createJwtToken(req.body.username);
  return sendJsonSuccess(res, {jwtToken: jwtToken}, 'Anmeldung erfolgreich.');
};

export const update = async (req: Request, res: Response) => {
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  try {
    await User.update(req.body, {
      where: {id: req.body.id},
      fields: Object.keys(req.body),
    });
    return sendJsonSuccess(res, [], 'Benutzer erfolgreich aktualisiert.');
  } catch (e: any) {
    const message = 'Benutzer aktualisieren fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.';
    return sendJsonError(res, message);
  }
};

export const remove = async (req: Request, res: Response) => {
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  const amountDestroyed = await User.destroy({
    where: {id: req.body.id},
    force: !!req.body.force,
  });
  if (!amountDestroyed) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.id} ist entweder inexistent oder bereits gelöscht`);
  }
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich gelöscht');
};

export const restore = async (req: Request, res: Response) => {
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  await User.restore({where: {id: req.body.id}});
  return sendJsonSuccess(res, [], 'Benutzer wiederhergestellt.');
};
