import {Request} from 'express-jwt';
import {Response} from 'express';
import User from '../models/User.js';
import {
  checkRequiredParams,
  copy,
  isAuthenticatedAdmin,
  paramsToObject,
  sendJsonError,
  sendJsonSuccess,
} from '../server/json.js';

import * as dotenv from 'dotenv';
import {createJwtToken, encryptPassword, userSelectAttributes} from '../server/auth.js';
import {login as ldapLogin} from '../server/ldap.js';
dotenv.config();

const REGISTRATION_PASSWORD_ACTIVE = process.env.REGISTRATION_PASSWORD_ACTIVE;
const REGISTRATION_PASSWORD = process.env.REGISTRATION_PASSWORD;

export const index = (req: Request, res: Response) => {
  return getAll(req, res);
};

export const getAll = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const users = await User.findAll({attributes: userSelectAttributes});
  return sendJsonSuccess(res, users);
};

export const getData = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  const user = await User.findOne({where: {username: req.auth.username}, attributes: userSelectAttributes});
  if (!user) {
    return sendJsonError(res, `Benutzer '${req.auth.username}' nicht gefunden.`, 404);
  }
  return sendJsonSuccess(res, user);
};

export const getDataById = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt.');
  }
  const user = await User.findByPk(req.body.id, {attributes: userSelectAttributes});
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID '${req.body.id}' nicht gefunden.`, 404);
  }
  return sendJsonSuccess(res, user);
};

export const register = async (req: Request, res: Response) => {
  if (req.auth && req.auth.username) {
    return sendJsonSuccess(res, [], 'Bereits angemeldet.');
  }
  const requiredParams = ['username', 'firstName', 'lastName', 'gender', 'matriculationNumber', 'email', 'password'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  if (Number(REGISTRATION_PASSWORD_ACTIVE) && REGISTRATION_PASSWORD !== req.body.registrationPassword) {
    return sendJsonError(res, 'Falsches Registrierungskennwort.');
  }
  try {
    const params = paramsToObject(req, requiredParams);
    await User.create(params);
    const jwtToken = createJwtToken(req.body.username);
    return sendJsonSuccess(res, {jwtToken: jwtToken}, 'Benutzer erfolgreich angelegt.');
  } catch (e: any) {
    let message = 'Benutzer anlegen fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.';
    if (e.parent?.code === 'ER_DUP_ENTRY') {
      message = 'Benutzername bereits vergeben. Bitte wählen Sie einen anderen.';
    }
    return sendJsonError(res, message);
  }
};

export const login = async (req: Request, res: Response) => {
  if (req.auth && req.auth.username) {
    return sendJsonSuccess(res, [], 'Bereits angemeldet.');
  }
  const requiredParams = ['username', 'password'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const ldapData = await ldapLogin(req.body.username, req.body.password);
  if (ldapData) {
    // if ldap login with user data was successful
    // check if user is already in db and create it if not
    const user = await User.findOne({where: {username: req.body.username}});
    if (!user) {
      const params = {
        username: req.body.username,
        password: req.body.password,
        ...ldapData,
      };
      try {
        await User.create(params);
      } catch (e: any) {
        const message = 'Benutzer im LDAP, anlegen im System aber fehlgeschlagen. Versuchen Sie es später erneut.';
        return sendJsonError(res, message, 500);
      }
    }
  } else {
    // check if user exists in db
    const params = paramsToObject(req, requiredParams);
    params.password = encryptPassword(params.password);
    const user = await User.findOne({where: params});
    if (!user) {
      return sendJsonError(res, 'Benutzername oder Password falsch.');
    }
  }
  const jwtToken = createJwtToken(req.body.username);
  return sendJsonSuccess(res, {jwtToken: jwtToken}, 'Anmeldung erfolgreich.');
};

export const create = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['username', 'firstName', 'lastName', 'gender', 'matriculationNumber', 'email', 'password'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  try {
    const params = [...requiredParams, 'isAdmin', 'isTutor'];
    const createParams = paramsToObject(req, params);
    const user = await User.create(createParams);
    const userData = copy(user, ['password']);
    return sendJsonSuccess(res, user, 'Benutzer erfolgreich angelegt.');
  } catch (e: any) {
    let message = 'Benutzer anlegen fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.';
    if (e.parent?.code === 'ER_DUP_ENTRY') {
      message = 'Benutzername bereits vergeben. Bitte wählen Sie einen anderen.';
    }
    return sendJsonError(res, message);
  }
};

export const remove = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt.');
  }
  const amountDestroyed = await User.destroy({where: {id: req.body.id}});
  if (!amountDestroyed) {
    return sendJsonSuccess(
      res,
      [],
      `Benutzer mit der ID '${req.body.id}' ist entweder inexistent oder bereits gelöscht.`
    );
  }
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich gelöscht.');
};

export const changeGender = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  if (!req.body.gender) {
    return sendJsonError(res, 'Kein Geschlecht angegeben.');
  }
  try {
    await User.update({gender: req.body.gender}, {where: {username: req.auth.username}});
  } catch (e: any) {
    return sendJsonError(res, 'Bearbeitung fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.');
  }
  return sendJsonSuccess(res, [], 'Geschlecht erfolgreich aktualisiert.');
};

export const changeGenderById = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  if (!req.body.gender) {
    return sendJsonError(res, 'Kein Geschlecht angegeben.');
  }
  try {
    await User.update({gender: req.body.gender}, {where: {id: req.body.id}});
  } catch (e: any) {
    return sendJsonError(res, 'Bearbeitung fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.');
  }
  return sendJsonSuccess(res, [], 'Geschlecht erfolgreich aktualisiert.');
};

export const changeRole = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  if (!req.body.role) {
    return sendJsonError(res, 'Keine Rolle angegeben.');
  }
  try {
    await User.update({role: req.body.role}, {where: {id: req.body.id}});
  } catch (e: any) {
    return sendJsonError(res, 'Bearbeitung fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.');
  }
  return sendJsonSuccess(res, [], 'Rolle erfolgreich aktualisiert.');
};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  if (!req.body.passwordOld || !req.body.passwordNew) {
    return sendJsonError(res, 'Kein Passwort angegeben.');
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return sendJsonError(res, 'Authentifizierter Benutzer existiert nicht mehr.', 404);
  }
  if (user.password !== encryptPassword(req.body.passwordOld)) {
    return sendJsonError(res, 'Altes Passwort fehlerhaft.');
  }
  try {
    await User.update({password: req.body.passwordNew}, {where: {username: req.auth.username}});
  } catch (e: any) {
    return sendJsonError(res, 'Bearbeitung fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.');
  }
  return sendJsonSuccess(res, [], 'Passwort erfolgreich aktualisiert.');
};

export const resetPassword = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  if (!req.body.passwordNew) {
    return sendJsonError(res, 'Kein Passwort angegeben.');
  }
  try {
    await User.update({password: req.body.passwordNew}, {where: {id: req.body.id}});
  } catch (e: any) {
    return sendJsonError(res, 'Bearbeitung fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.');
  }
  return sendJsonSuccess(res, [], 'Passwort erfolgreich aktualisiert.');
};
