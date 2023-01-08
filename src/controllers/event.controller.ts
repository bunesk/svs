import {Request} from 'express-jwt';
import {Response} from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import {
  checkRequiredParams,
  isAuthenticatedAdmin,
  paramsToObject,
  sendJsonError,
  sendJsonSuccess,
} from '../server/json.js';

export const index = (req: Request, res: Response) => {
  return getAll(req, res);
};

export const getAll = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const users = await Event.findAll();
  return sendJsonSuccess(res, users);
};

export const getData = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  const event = await Event.findOne({where: {id: req.body.id}});
  if (!event) {
    return sendJsonError(res, `Keine Veranstaltung mit der ID ${req.body.userId} gefunden.`, 404);
  }
  // event.hasUser(user);
  return sendJsonSuccess(res, event);
};

export const getByUser = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return sendJsonError(res, `Benutzer '${req.auth.username}' nicht gefunden.`, 404);
  }
  const events = user.getEvents();
  return sendJsonSuccess(res, events);
};

export const getByUserId = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.userId) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  const user = await User.findOne({where: {id: req.body.userId}});
  if (!user) {
    return sendJsonError(res, `Keinen Benutzer mit der ID ${req.body.userId} gefunden.`, 404);
  }
  const events = user.getEvents();
  return sendJsonSuccess(res, events);
};

export const getMembers = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  const event = await Event.findOne({where: {id: req.body.id}});
  if (!event) {
    return sendJsonError(res, `Keine Veranstaltung mit der ID ${req.body.id} gefunden.`, 404);
  }
  const users = await event.getUsers();
  return sendJsonSuccess(res, users);
};

export const create = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['name', 'password', 'amountTests', 'amountSheets', 'pointsMax', 'pointsPassed'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  if (Number(req.body.pointsMax) < Number(req.body.pointsPassed)) {
    return sendJsonError(res, 'Maximale Punktzahl kann nicht niedriger als notwendige Punkte zum Bestehen sein.');
  }
  try {
    const params = paramsToObject(req, requiredParams);
    params.visible = !!req.params.visible;
    await Event.create(params);
    return sendJsonSuccess(res, [], 'Veranstaltung erfolgreich angelegt.');
  } catch (e: any) {
    const message = 'Veranstaltung anlegen fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.';
    return sendJsonError(res, message);
  }
};

export const update = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  try {
    await Event.update(req.body, {
      where: {id: req.body.id},
      fields: Object.keys(req.body),
    });
    return sendJsonSuccess(res, [], 'Veranstaltung erfolgreich aktualisiert.');
  } catch (e: any) {
    const message =
      'Veranstaltung aktualisieren fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.';
    return sendJsonError(res, message);
  }
};

export const remove = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltung-ID fehlt');
  }
  const amountDestroyed = await Event.destroy({where: {id: req.body.id}});
  if (!amountDestroyed) {
    return sendJsonSuccess(
      res,
      [],
      `Veranstaltung mit der ID ${req.body.id} ist entweder inexistent oder bereits gelöscht`
    );
  }
  return sendJsonSuccess(res, [], 'Veranstaltung erfolgreich gelöscht');
};

export const resetPassword = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  if (!req.body.passwordNew) {
    return sendJsonError(res, 'Kein Passwort angegeben.');
  }
  await Event.update({password: req.body.passwordNew}, {where: {id: req.body.id}});
  return sendJsonSuccess(res, [], 'Passwort erfolgreich aktualisiert.');
};

export const isMember = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  const requiredParams = ['eventId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findOne({where: {id: req.body.userId}});
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const isMember = await user.hasEvent(req.body.eventId as number);
  return sendJsonSuccess(res, {isMember: isMember});
};

export const addMember = async (req: Request, res: Response) => {
  const requiredParams = ['eventId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findOne({where: {id: req.body.userId}});
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const event = await Event.findOne({where: {id: req.body.eventId}});
  if (!event) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.eventId} nicht gefunden.`, 404);
  }
  if (await event.hasUser(user)) {
    return sendJsonSuccess(res, [], 'Benutzer ist bereits Mitglied. Es wurde nichts unternommen.');
  }
  await event.addUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich zur Veranstaltung hinzugefügt.');
};

export const removeMember = async (req: Request, res: Response) => {
  const requiredParams = ['eventId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findOne({where: {id: req.body.userId}});
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const event = await Event.findOne({where: {id: req.body.eventId}});
  if (!event) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.eventId} nicht gefunden.`, 404);
  }
  if (!(await event.hasUser(user))) {
    return sendJsonSuccess(res, [], 'Benutzer ist kein Mitglied. Es wurde nichts unternommen.');
  }
  await event.removeUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich von der Veranstaltung entfernt.');
};
