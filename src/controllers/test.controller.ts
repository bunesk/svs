import {Request} from 'express-jwt';
import {Response} from 'express';
import Event from '../models/Event.js';
import Task from '../models/Task.js';
import Test from '../models/Test.js';
import User from '../models/User.js';
import UserTask from '../models/UserTask.js';
import {copy, getEventOrTestData, isAuthenticatedAdmin, sendJsonError, sendJsonSuccess} from '../server/json.js';
import {userSelectAttributes} from '../server/auth.js';

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
  const result = await getEventOrTestData(req);
  if (!result.status) {
    return sendJsonError(res, result.message, result.statusCode);
  }
  const event = result.item as Event;
  const teams = await event.getTests({where: {isSheet: !!req.body.isSheet}});
  return sendJsonSuccess(res, teams);
};

export const getData = async (req: Request, res: Response) => {
  const result = await getEventOrTestData(req);
  if (!result.status) {
    return sendJsonError(res, result.message, result.statusCode);
  }
  const test = result.item as Test;
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
  const result = await getEventOrTestData(req);
  if (!result.status) {
    return sendJsonError(res, result.message, result.statusCode);
  }
  const test = result.item as Test;
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

export const getTestRatings = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req, true);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  const test = await Test.findOne({where: {id: req.body.id, isSheet: false}});
  if (!test) {
    return sendJsonError(res, `Test mit der ID ${req.body.id} nicht gefunden.`);
  }
  const tasks = await test.getTasks();
  const event = await test.getEvent();
  const users = await event.getUsers({attributes: userSelectAttributes});
  let result: any = {
    users: [],
    tasks: tasks,
  };
  for (const user of users) {
    if (user.isAdmin || user.isTutor) {
      continue;
    }
    const userData: any = copy(user);
    const points: any = {};
    for (const task of tasks) {
      const userTask = await UserTask.findOne({where: {UserId: user.id, TaskId: task.id}});
      if (userTask) {
        points[task.id] = userTask.points;
      } else {
        points[task.id] = 0;
      }
    }
    userData.tasks = points;
    result.users.push(userData);
  }
  return sendJsonSuccess(res, result);
};

export const rateTest = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req, true);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  for (const [userId, tasks] of Object.entries(req.body)) {
    const user = await User.findByPk(userId);
    if (!user) {
      return sendJsonError(res, `Benutzer mit der ID ${userId} nicht gefunden.`);
    }
    for (const [taskId, taskPoints] of Object.entries(tasks as any)) {
      const task = await Task.findByPk(taskId);
      if (!task) {
        return sendJsonError(res, `Aufgabe mit der ID ${taskId} nicht gefunden.`);
      }
      try {
        const [userTask, built] = await UserTask.findOrBuild({where: {UserId: userId, TaskId: taskId}});
        userTask.points = taskPoints as number;
        if (built) {
          await UserTask.create({points: taskPoints, UserId: userId, TaskId: taskId});
        } else {
          await UserTask.update({points: taskPoints}, {where: {UserId: userId, TaskId: taskId}});
        }
      } catch (e: any) {
        return sendJsonError(
          res,
          `Punkte eintragen für Benutzer ${user.fullName} für Task mit der ID ${taskId} fehlgeschlagen.`
        );
      }
    }
  }
  return sendJsonSuccess(res, [], 'Punkte erfolgreich eingetragen.');
};
