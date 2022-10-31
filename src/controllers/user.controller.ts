import {Request, Response} from 'express';

export const index = (req: Request, res: Response) => {
  res.json({
    title: 'Index',
  });
};

export const getName = (req: Request, res: Response) => {
  res.json({
    title: 'getName',
  });
};
