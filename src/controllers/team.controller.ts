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
import {userSelectAttributes} from '../server/auth.js';

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
  const result = await getJoinableData(req, 'Team');
  if (!result.status) {
    return sendJsonError(res, result.message, result.statusCode);
  }
  return sendJsonSuccess(res, result.item);
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
  const teams = await event.getTeams({order: ['block']});
  return sendJsonSuccess(res, teams);
};

export const getMembers = async (req: Request, res: Response) => {
  const result = await getJoinableData(req, 'Team');
  if (!result.status) {
    return sendJsonError(res, result.message, result.statusCode);
  }
  const members = await (result.item as Team).getUsers({attributes: userSelectAttributes});
  return sendJsonSuccess(res, members);
};

export const create = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['EventId', 'block'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const event = await Event.findByPk(req.body.EventId);
  if (!event) {
    return sendJsonError(res, `Keine Veranstaltung mit der ID ${req.body.EventId} angegeben.`);
  }
  const max = (await Team.max('number', {where: {block: req.body.block}})) ?? '0';
  try {
    const params = paramsToObject(req, [...requiredParams]);
    params.number = (max as number) + 1;
    await Team.create(params);
    return sendJsonSuccess(res, [], 'Team erfolgreich angelegt.');
  } catch (e: any) {
    return sendJsonError(res, 'Team anlegen fehlgeschlagen.');
  }
};

export const update = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['id', 'block', 'number'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const team = await Team.findByPk(req.body.id);
  if (!team) {
    return sendJsonError(res, `Team mit der ID ${req.body.id} nicht gefunden`);
  }
  if (team.block == req.body.block && team.number == req.body.number) {
    return sendJsonSuccess(res, [], 'Speichern erfolgreich, es gab aber keine Veränderungen.');
  }
  const anotherTeam = await Team.findOne({where: {block: req.body.block, number: req.body.number}});
  if (anotherTeam) {
    return sendJsonError(res, 'Es existiert bereits ein Team mit dieser Block-Nummer-Kombination.');
  }
  const params = paramsToObject(req, requiredParams);
  try {
    await Team.update(params, {
      where: {id: req.body.id},
      fields: requiredParams,
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
    return sendJsonError(res, `Team mit der ID ${req.body.id} ist entweder inexistent oder bereits gelöscht.`);
  }
  return sendJsonSuccess(res, [], 'Team erfolgreich gelöscht');
};

export const addMember = async (req: Request, res: Response) => {
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
  if (await team.hasUser(user)) {
    return sendJsonSuccess(res, [], 'Benutzer ist bereits Mitglied. Es wurde nichts unternommen.');
  }
  const event = await team.getEvent();
  const teams = await user.getTeams({where: {EventId: event.id}});
  if (teams.length) {
    return sendJsonError(res, 'Benutzer hat in dieser Veranstaltung bereits ein Team.');
  }
  await team.addUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich zur Veranstaltung hinzugefügt.');
};

export const removeMember = async (req: Request, res: Response) => {
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
    return sendJsonError(res, `Team mit der ID ${req.body.teamId} nicht gefunden.`, 404);
  }
  if (!(await team.hasUser(user))) {
    return sendJsonSuccess(res, [], 'Benutzer ist kein Mitglied. Es wurde nichts unternommen.');
  }
  await team.removeUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich aus dem Team entfernt.');
};
