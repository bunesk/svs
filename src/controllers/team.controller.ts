import {Request} from 'express-jwt';
import {Response} from 'express';
import Team from '../models/Team.js';
import User from '../models/User.js';
import {checkRequiredParams, paramsToObject, sendJsonError, sendJsonSuccess} from '../server/json.js';

export const index = (req: Request, res: Response) => {
  return getAll(req, res);
};

export const getAll = async (req: Request, res: Response) => {
  const users = await Team.findAll({paranoid: !req.body.includeInactive});
  return sendJsonSuccess(res, users);
};

export const getData = async (req: Request, res: Response) => {
  if (!req.body.id) {
    return sendJsonError(res, 'Team-ID fehlt');
  }
  const event = await Team.findOne({where: {id: req.body.id}});
  if (!event) {
    return sendJsonError(res, `Keinen Team mit der ID ${req.body.userId} gefunden.`, 404);
  }
  return sendJsonSuccess(res, event);
};

export const create = async (req: Request, res: Response) => {
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
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  const amountDestroyed = await Team.destroy({
    where: {id: req.body.id},
    force: !!req.body.force,
  });
  if (!amountDestroyed) {
    return sendJsonError(res, `Team mit der ID ${req.body.id} ist entweder inexistent oder bereits gelöscht`);
  }
  return sendJsonSuccess(res, [], 'Team erfolgreich gelöscht');
};

export const restore = async (req: Request, res: Response) => {
  if (!req.body.id) {
    return sendJsonError(res, 'Team-ID fehlt');
  }
  await Team.restore({where: {id: req.body.id}});
  return sendJsonSuccess(res, [], 'Team wiederhergestellt.');
};

export const addUser = async (req: Request, res: Response) => {
  const requiredParams = ['teamId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findOne({where: {id: req.body.userId}});
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const team = await Team.findOne({where: {id: req.body.teamId}});
  if (!team) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.teamId} nicht gefunden.`, 404);
  }
  await team.addUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich zur Veranstaltung hinzugefügt.');
};

export const removeUser = async (req: Request, res: Response) => {
  const requiredParams = ['teamId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findOne({where: {id: req.body.userId}});
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const team = await Team.findOne({where: {id: req.body.teamId}});
  if (!team) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.teamId} nicht gefunden.`, 404);
  }
  await team.removeUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich aus dem Team entfernt.');
};
