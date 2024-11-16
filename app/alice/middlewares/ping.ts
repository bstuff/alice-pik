import { RequestHandler } from 'express';

export const pingMiddleware: RequestHandler = (_req, res) => {
  res.send();
};
