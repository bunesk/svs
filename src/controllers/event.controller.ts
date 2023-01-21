import {Request} from 'express-jwt';
import {Response} from 'express';
import Event from '../models/Event.js';
import Task from '../models/Task.js';
import Test from '../models/Test.js';
import User from '../models/User.js';
import UserTask from '../models/UserTask.js';
import {encryptPassword, userSelectAttributes} from '../server/auth.js';
import {
  checkRequiredParams,
  copy,
  eventSelectAttributes,
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
  const users = await Event.findAll({attributes: eventSelectAttributes});
  return sendJsonSuccess(res, users);
};

export const getAllNames = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  const users = await Event.findAll({where: {visible: true}, attributes: ['id', 'name']});
  return sendJsonSuccess(res, users);
};

export const getData = async (req: Request, res: Response) => {
  const result = await getJoinableData(req, 'Event');
  if (!result.status) {
    return sendJsonError(res, result.message, result.statusCode);
  }
  return sendJsonSuccess(res, result.item);
};

export const getByUser = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return sendJsonError(res, `Benutzer '${req.auth.username}' nicht gefunden.`, 404);
  }
  const events = await user.getEvents({attributes: eventSelectAttributes});
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
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return sendJsonError(res, `Keinen Benutzer mit der ID ${req.body.userId} gefunden.`, 404);
  }
  const events = await user.getEvents({attributes: eventSelectAttributes});
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
  const event = await Event.findByPk(req.body.id);
  if (!event) {
    return sendJsonError(res, `Keine Veranstaltung mit der ID ${req.body.id} gefunden.`, 404);
  }
  const users = await event.getUsers({attributes: userSelectAttributes});
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
  try {
    await Event.update({password: req.body.passwordNew}, {where: {id: req.body.id}});
  } catch (e: any) {
    return sendJsonError(res, 'Bearbeitung fehlgeschlagen. Bitte Eingaben überprüfen oder später erneut versuchen.');
  }
  return sendJsonSuccess(res, [], 'Passwort erfolgreich aktualisiert.');
};

export const isMember = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  if (user.isAdmin && req.body.includeAdmin) {
    return sendJsonSuccess(res, {isMember: true});
  }
  const event = await Event.findByPk(req.body.id);
  if (!event) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.id} nicht gefunden.`, 404);
  }
  const isMember = await user.hasEvent(event);
  return sendJsonSuccess(res, {isMember: isMember});
};

export const join = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  if (!req.body.password) {
    return sendJsonError(res, 'Passwort fehlt');
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return sendJsonError(res, 'Authentifizierter Benutzer existiert nicht mehr.', 404);
  }
  const password = encryptPassword(req.body.password);
  const event = await Event.findOne({where: {id: req.body.id, password: password}});
  if (!event) {
    return sendJsonError(res, `Falsches Passwort.`, 401);
  }
  if (await event.hasUser(user)) {
    return sendJsonSuccess(res, [], 'Benutzer ist bereits Mitglied. Es wurde nichts unternommen.');
  }
  await event.addUser(user);
  return sendJsonSuccess(res, [], 'Benutzer erfolgreich zur Veranstaltung hinzugefügt.');
};

export const addMember = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['eventId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const event = await Event.findByPk(req.body.eventId);
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
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  const requiredParams = ['eventId', 'userId'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`, 404);
  }
  const event = await Event.findByPk(req.body.eventId);
  if (!event) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.eventId} nicht gefunden.`, 404);
  }
  if (!(await event.hasUser(user))) {
    return sendJsonSuccess(res, [], 'Benutzer ist kein Mitglied. Es wurde nichts unternommen.');
  }
  let teamMessage = '';
  const teams = await user.getTeams({where: {EventId: event.id}});
  for (const team of teams) {
    team.removeUser(user);
    teamMessage = teamMessage.length ? '' : 'und dem Team';
  }
  await event.removeUser(user);
  return sendJsonSuccess(res, [], `Benutzer erfolgreich von der Veranstaltung ${teamMessage} entfernt.`);
};

export const getOwnTeam = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return {status: false, message: 'Authentifizierter Benutzer existiert nicht mehr.', statusCode: 404};
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  const event = await Event.findByPk(req.body.id);
  if (!event) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.id} nicht gefunden.`);
  }
  if (!(await user.hasEvent(event))) {
    return sendJsonError(res, 'Du bist kein Mitglied der Veranstaltung.', 403);
  }
  const teams = await user.getTeams({where: {EventId: event.id}});
  if (!teams.length) {
    return sendJsonSuccess(res, [], 'Du bist in keinem Team.');
  }
  const teamData = copy(teams[0]);
  teamData.users = await teams[0].getUsers({attributes: userSelectAttributes});
  return sendJsonSuccess(res, teamData);
};

export const getTestsByUser = async (req: Request, res: Response) => {
  const hasPermission = await isAuthenticatedAdmin(req);
  if (!hasPermission.status) {
    return sendJsonError(res, hasPermission.message, hasPermission.statusCode);
  }
  if (!req.body.userId) {
    return sendJsonError(res, 'Benutzer-ID fehlt');
  }
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return sendJsonError(res, `Benutzer mit der ID ${req.body.userId} nicht gefunden.`);
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  const event = await Event.findByPk(req.body.id);
  if (!event) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.id} nicht gefunden.`);
  }
  const tests = await event.getTests({include: 'Tasks', where: {isSheet: false}, order: ['number']});
  const sheets = await event.getTests({include: 'Tasks', where: {isSheet: true}, order: ['number']});
  const [resultTests, pointsTests] = await iterateTests(tests, user);
  const [resultSheets, pointsSheets] = await iterateTests(sheets, user);
  const result = {
    tests: resultTests,
    sheets: resultSheets,
    points: pointsTests.points + pointsSheets.points,
    pointsMax: pointsTests.pointsMax + pointsSheets.pointsMax,
  };
  return sendJsonSuccess(res, result);
};

export const getOwnTests = async (req: Request, res: Response) => {
  if (!req.auth || !req.auth.username) {
    return sendJsonError(res, 'Authentifizierung fehlgeschlagen.', 401);
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return {status: false, message: 'Authentifizierter Benutzer existiert nicht mehr.', statusCode: 404};
  }
  if (!req.body.id) {
    return sendJsonError(res, 'Veranstaltungs-ID fehlt');
  }
  const event = await Event.findByPk(req.body.id);
  if (!event) {
    return sendJsonError(res, `Veranstaltung mit der ID ${req.body.id} nicht gefunden.`);
  }
  if (!(await user.hasEvent(event))) {
    return sendJsonError(res, 'Du bist kein Mitglied der Veranstaltung.', 403);
  }
  const tests = await event.getTests({include: 'Tasks', where: {isSheet: false}, order: ['number']});
  const sheets = await event.getTests({include: 'Tasks', where: {isSheet: true}, order: ['number']});
  const [resultTests, pointsTests] = await iterateTests(tests, user);
  const [resultSheets, pointsSheets] = await iterateTests(sheets, user);
  const result = {
    tests: resultTests,
    sheets: resultSheets,
    points: pointsTests.points + pointsSheets.points,
    pointsMax: pointsTests.pointsMax + pointsSheets.pointsMax,
  };
  return sendJsonSuccess(res, result);
};

const iterateTests = async (tests: Test[], user: User) => {
  const testsData = [];
  const pointsAll: any = {
    points: 0,
    pointsMax: 0,
  };
  for (const test of tests) {
    const testData = copy(test);
    const tasksData = [];
    const taskIds = [];
    for (const task of testData.Tasks) {
      taskIds.push(task.id);
      const taskData = copy(task);
      const userTask = await UserTask.findOne({where: {UserId: user.id, TaskId: task.id}});
      if (userTask) {
        taskData.points = userTask.points;
      } else {
        taskData.points = 0;
      }
      tasksData.push(taskData);
    }
    testData.Tasks = tasksData;
    testData.pointsMax = (await Task.sum('pointsMax', {where: {TestId: test.id}})) ?? 0;
    testData.points = (await UserTask.sum('points', {where: {UserId: user.id, TaskId: taskIds}})) ?? 0;
    pointsAll.points += testData.points;
    pointsAll.pointsMax += testData.pointsMax;
    testsData.push(testData);
  }
  return [testsData, pointsAll];
};
