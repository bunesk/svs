import {Request, Response} from 'express';
import Test from '../models/Test.js';
import {checkRequiredParams, paramsToObject, sendJsonError, sendJsonSuccess} from '../server/json.js';

export const index = (req: Request, res: Response) => {
  return getAll(req, res);
};

export const getAll = async (req: Request, res: Response) => {
  const users = await Test.findAll({paranoid: !req.body.includeInactive});
  return sendJsonSuccess(res, users);
};

export const getData = async (req: Request, res: Response) => {
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  const event = await Test.findOne({where: {id: req.body.id}});
  if (!event) {
    return sendJsonError(res, `Keinen Test mit der ID ${req.body.userId} gefunden.`, 404);
  }
  return sendJsonSuccess(res, event);
};

export const create = async (req: Request, res: Response) => {
  const requiredParams = ['points', 'testNumber', 'walkingNumber'];
  const message = checkRequiredParams(req, requiredParams);
  if (message) {
    return sendJsonError(res, message);
  }
  try {
    const params = paramsToObject(req, [...requiredParams]);
    params.isSheet = !!req.params.isSheet;
    await Test.create(params);
    return sendJsonSuccess(res, [], 'Test erfolgreich angelegt.');
  } catch (e: any) {
    return sendJsonError(res, message);
  }
};

export const update = async (req: Request, res: Response) => {
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
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  const amountDestroyed = await Test.destroy({
    where: {id: req.body.id},
    force: !!req.body.force,
  });
  if (!amountDestroyed) {
    return sendJsonError(res, `Test mit der ID ${req.body.id} ist entweder inexistent oder bereits gelöscht`);
  }
  return sendJsonSuccess(res, [], 'Test erfolgreich gelöscht');
};

export const restore = async (req: Request, res: Response) => {
  if (!req.body.id) {
    return sendJsonError(res, 'Test-ID fehlt');
  }
  await Test.restore({where: {id: req.body.id}});
  return sendJsonSuccess(res, [], 'Test wiederhergestellt.');
};