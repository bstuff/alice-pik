import { RequestHandler } from 'express';

export const userUnlinkMiddleware: RequestHandler = (req, res) => {
  const request_id = req.header('x-request-id');

  res.json({ request_id });
};
