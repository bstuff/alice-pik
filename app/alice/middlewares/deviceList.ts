import _debug from 'debug';
import { RequestHandler } from 'express';

import { DeviceListResponse } from '../types';

const debug = _debug('app:alice:m:list');
const logRequest = debug.extend('request');
const logResponse = debug.extend('response');

export const deviceListMiddleware: RequestHandler = (req, res) => {
  const request_id = req.header('x-request-id') || '';
  logRequest(JSON.stringify(req.body, null, 2));

  const response: DeviceListResponse = {
    request_id,
    payload: {
      user_id: 'Bstf-01-super-545',
      // @ts-expect-error kek!
      devices: global.__devices.map((d) => d.toJson()),
    },
  };

  logResponse(JSON.stringify(response, null, 2));
  res.json(response);
};
