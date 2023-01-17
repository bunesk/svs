import {Request} from 'express-jwt';
import {Response} from 'express';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import {
  checkRequiredParams,
  getJoinableData,
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
  const teams = await Team.findAll();
  return sendJsonSuccess(res, teams);
};

export const getData = async (req: Request, res: Response) => {
  const result = await getJoinableData(req, 'Event');
  if (!result.status) {
    return sendJsonError(res, result.message, result.statusCode);
  }
  return sendJsonSuccess(res, result.item);
};

export const create = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['number', 'block'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  try {
    const params = paramsToObject(req, [...requiredParams]);
    await Team.create(params);
    return sendJsonSuccess(res, [], 'Team erfolgreich angelegt.');
  } catch (e: any) {
    return sendJsonError(res, message);
  }
};

export const update = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Team-ID fehlt');
  }
  try {
    await Team.update(req.body, {
      where: {id: req.body.id},
      fields: Object.keys(req.body),
    });
    return sendJsonSuccess(res, [], 'Test erfolgreich aktualisiert.');
  } catch (e: any) {
    const message = 'Test aktualisieren fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.';
    return sendJsonError(res, message);
  }
};

export const remove = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  const amountDestroyed = await Team.destroy({where: {id: req.body.id}});
  if (!amountDestroyed) {
    return sendJsonError(res, `Team mit der ID ${req.body.id} ist entweder inexistent oder bereits gelöscht`);
  }
  return sendJsonSuccess(res, [], 'Team erfolgreich gelöscht');
};

export const getByEvent = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.eventId) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  const event = await Event.findByPk(req.body.eventId);
  if (!event) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.eventId} nicht gefunden.`, 404);
  }
  const teams = await event.getTeams();
  return sendJsonSuccess(res, teams);
};

export const addUser = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['teamId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const team = await Team.findByPk(req.body.teamId);
  if (!team) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.teamId} nicht gefunden.`, 404);
  }
  await team.addUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich zur Veranstaltung hinzugefügt.');
};

export const removeUser = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['teamId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const team = await Team.findByPk(req.body.teamId);
  if (!team) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.teamId} nicht gefunden.`, 404);
  }
  await team.removeUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich aus dem Team entfernt.');
};
