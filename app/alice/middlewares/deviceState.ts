import _debug from 'debug';
import { RequestHandler } from 'express';

import { DeviceErrorCode, DeviceStateResponse, DeviceStateResponseDevice } from '../types';

const debug = _debug('app:alice:m:query');
const logRequest = debug.extend('request');
const logResponse = debug.extend('response');

// @ts-expect-error kek!
export const deviceStateMiddleware: RequestHandler = (req, res, next) => {
  const request_id = req.header('x-request-id') || '';
  logRequest(JSON.stringify(req.body, null, 2));

  const { devices } = req.body;

  if (Array.isArray(devices)) {
    const devicesResponse = devices.map((reqDevice): DeviceStateResponseDevice => {
      // @ts-expect-error kek!
      const localDevice = global.__devices.find(({ id }) => id === reqDevice.id);
      if (!localDevice) {
        return {
          id: reqDevice.id,
          error_code: DeviceErrorCode.DEVICE_NOT_FOUND,
        };
      }

      return localDevice.getState();
    });

    const response: DeviceStateResponse = {
      request_id,
      payload: {
        devices: devicesResponse,
      },
    };

    logResponse(JSON.stringify(response, null, 2));

    return res.json(response);
  }

  return next();
};
