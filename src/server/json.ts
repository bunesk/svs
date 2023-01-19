import {Request} from 'express-jwt';
import {Response} from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Team from '../models/Team.js';
import Test from '../models/Test.js';

export const eventSelectAttributes = [
  'amountSheets',
  'amountTests',
  'createdAt',
  'id',
  'name',
  'pointsMax',
  'pointsPassed',
  'updatedAt',
  'visible',
  'visibleLabel',
];

export const copy = (object: object, entriesToRemove: Array<string> = []) => {
  const copiedObject = JSON.parse(JSON.stringify(object));
  for (const entry of entriesToRemove) {
    delete copiedObject[entry];
  }
  return copiedObject;
};

/**
 * Checks if all the passed parameters exist
 *
 * @param req
 * @param params
 * @returns
 */
export const checkRequiredParams = (req: Request, params: string[]): string | undefined => {
  for (const param of params) {
    if (req.body[param] === undefined) {
      return `Parameter '${param}' is missing.`;
    }
  }
};

export const paramsToObject = (req: Request, params: string[]) => {
  const paramsObject: any = {};
  for (const param of params) {
    paramsObject[param] = req.body[param];
  }
  return paramsObject;
};

export const isAuthenticatedAdmin = async (
  req: Request
): Promise<{status: boolean; message?: string; statusCode?: number}> => {
  if (!req.auth || !req.auth.username) {
    return {status: false, message: 'Authentifizierung fehlgeschlagen.', statusCode: 401};
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return {status: false, message: 'Authentifizierter Benutzer existiert nicht mehr.', statusCode: 404};
  }
  if (!user.isAdmin) {
    return {status: false, message: 'Du bist nicht berechtigt.', statusCode: 403};
  }
  return {status: true};
};

export const getEventOrTestData = async (
  req: Request
): Promise<{status: boolean; message?: string; statusCode?: number; item?: Event | Test}> => {
  if (!req.auth || !req.auth.username) {
    return {status: false, message: 'Authentifizierung fehlgeschlagen.', statusCode: 401};
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return {status: false, message: 'Authentifizierter Benutzer existiert nicht mehr.', statusCode: 404};
  }
  let result: Event | Test | undefined = undefined;
  let eventId = req.body.eventId;
  if (!eventId) {
    if (req.body.id) {
      const test = await Test.findByPk(req.body.id);
      if (!test) {
        return {status: false, message: `Test mit der ID ${req.body.id} nicht gefunden.`, statusCode: 404};
      }
      eventId = test.EventId;
      result = test;
    } else {
      return {status: false, message: 'ID fehlt.', statusCode: 400};
    }
  }
  const event = await Event.findByPk(eventId);
  if (!event) {
    return {status: false, message: `Veranstaltung mit der ID ${eventId} nicht gefunden.`, statusCode: 400};
  }
  if (!result) {
    result = event;
  }
  if (user.isAdmin || (await user.hasEvent(event))) {
    return {status: true, item: result};
  }
  return {status: false, message: 'Du bist nicht berechtigt.', statusCode: 403};
};

export const getJoinableData = async (
  req: Request,
  memberOf: 'Event' | 'Team'
): Promise<{status: boolean; message?: string; statusCode?: number; item?: Event | Team}> => {
  if (!req.auth || !req.auth.username) {
    return {status: false, message: 'Authentifizierung fehlgeschlagen.', statusCode: 401};
  }
  const user = await User.findOne({where: {username: req.auth.username}});
  if (!user) {
    return {status: false, message: 'Authentifizierter Benutzer existiert nicht mehr.', statusCode: 404};
  }
  if (!req.body.id) {
    return {status: false, message: 'Veranstaltungs-ID fehlt', statusCode: 400};
  }
  let item: Event | Team | null = null;
  if (memberOf === 'Event') {
    if (user.isAdmin) {
      item = await Event.findByPk(req.body.id, {attributes: eventSelectAttributes});
    } else {
      item = await Event.findOne({where: {id: req.body.id, visible: true}, attributes: eventSelectAttributes});
    }
  } else {
    item = await Team.findByPk(req.body.id);
  }
  if (!item) {
    const name = memberOf === 'Event' ? 'Veranstaltung' : 'Team';
    return {status: false, message: `${name} mit der ID ${req.body.id} nicht gefunden.`, statusCode: 400};
  }
  // @ts-ignore
  const hasItem = await user[`has${memberOf}`](item);
  if (!user.isAdmin && !hasItem) {
    return {status: false, message: 'Du bist nicht berechtigt.', statusCode: 403};
  }
  return {status: true, item: item};
};

/**
 * Returns a json success response object.
 *
 * @param result request result
 * @param message success message
 * @returns json response object
 */
export const sendJsonSuccess = (res: Response, result: object | object[] = [], message = 'Aktion erfolgreich.') => {
  return res
    .status(200)
    .json({
      message: message,
      result: result,
    })
    .end();
};

/**
 * Returns a json error response object.
 *
 * @param message error message
 * @returns json response object
 */
export const sendJsonError = (res: Response, message = 'Es ist ein Fehler aufgetreten.', statusCode = 400) => {
  return res
    .status(statusCode)
    .json({
      message: message,
      result: [],
    })
    .end();
};
