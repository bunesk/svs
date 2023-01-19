import {Request} from 'express-jwt';
import {Response} from 'express';
import Test from '../models/Test.js';
import Task from '../models/Task.js';
import Event from '../models/Event.js';
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
  const users = await Test.findAll({paranoid: !req.body.includeInactive});
  return sendJsonSuccess(res, users);
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
  const teams = await event.getTests({where: {isSheet: !!req.body.isSheet}});
  return sendJsonSuccess(res, teams);
};

export const getData = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  const test = await Test.findByPk(req.body.id);
  if (!test) {
    return sendJsonError(res, `Keinen Test mit der ID ${req.body.userId} gefunden.`, 404);
  }
  return sendJsonSuccess(res, test);
};

export const create = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.EventId) {
    return sendJsonError(res, 'Keine Veranstaltungs-ID angegeben.');
  }
  const event = await Event.findByPk(req.body.EventId);
  if (!event) {
    return sendJsonError(res, `Keine Veranstaltung mit der ID ${req.body.EventId} gefunden.`);
  }
  const max = (await Test.max('number', {where: {EventId: req.body.EventId, isSheet: !!req.body.isSheet}})) ?? '0';
  const params = {
    number: (max as number) + 1,
    isSheet: !!req.body.isSheet,
    EventId: req.body.EventId,
  };
  try {
    const test = await Test.create(params);
    return sendJsonSuccess(res, [], `${test.name} erfolgreich angelegt.`);
  } catch (e: any) {
    return sendJsonError(res, 'Test anlegen fehlgeschlagen.');
  }
};

export const update = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  try {
    await Test.update(req.body, {
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
  const test = await Test.findByPk(req.body.id);
  if (!test) {
    return sendJsonError(res, `Test mit der ID ${req.body.id} ist entweder inexistent oder bereits gelöscht.`);
  }
  await Test.destroy({where: {id: req.body.id}});
  return sendJsonSuccess(res, [], `${test.name} erfolgreich gelöscht.`);
};

export const getTasks = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  const test = await Test.findByPk(req.body.id);
  if (!test) {
    return sendJsonError(res, `Test mit der ID ${req.body.id} nicht gefunden.`, 404);
  }
  const tasks = await test.getTasks();
  return sendJsonSuccess(res, tasks);
};

export const createTask = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Keine Test-ID angegeben.');
  }
  if (!req.body.pointsMax) {
    return sendJsonError(res, 'Keine maximale Punktzahl angegeben.');
  }
  const test = await Test.findByPk(req.body.id);
  if (!test) {
    return sendJsonError(res, `Keinen Test mit der ID ${req.body.id} gefunden.`);
  }
  const max = (await Task.max('number', {where: {TestId: req.body.id}})) ?? '0';
  const params = {
    pointsMax: req.body.pointsMax,
    number: (max as number) + 1,
    TestId: req.body.id,
  };
  try {
    const task = await Task.create(params);
    return sendJsonSuccess(res, [], `${task.name} erfolgreich angelegt.`);
  } catch (e: any) {
    return sendJsonError(res, 'Aufgabe anlegen fehlgeschlagen.');
  }
};

export const removeTask = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.taskId) {
    return sendJsonError(res, 'Aufgaben-ID fehlt');
  }
  const task = await Task.findByPk(req.body.taskId);
  if (!task) {
    return sendJsonError(res, `Aufgabe mit der ID ${req.body.taskId} ist entweder inexistent oder bereits gelöscht.`);
  }
  await Task.destroy({where: {id: req.body.taskId}});
  return sendJsonSuccess(res, [], `${task.name} erfolgreich gelöscht.`);
};
