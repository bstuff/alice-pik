import _debug from 'debug';
import { RequestHandler } from 'express';
import { from, of } from 'rxjs';
import { mergeMap, reduce } from 'rxjs/operators';

import {
  ActionResultErrorCode,
  ActionResultStatus,
  DeviceActionResponse,
  DeviceStateChangeResponse,
  StateChangeRequest,
} from '../types';

const debug = _debug('app:alice:m:action');
const logRequest = debug.extend('request');
const logResponse = debug.extend('response');

// @ts-expect-error kek!
export const actionMiddleware: RequestHandler = async (req, res, next) => {
  const request_id = req.header('x-request-id') || '';

  const { payload } = req.body as StateChangeRequest;
  const { devices } = payload;
  logRequest(JSON.stringify(req.body, null, 2));

  if (Array.isArray(devices)) {
    const devicesResponse = await from(devices)
      .pipe(
        mergeMap((device) => {
          // @ts-expect-error kek!
          const localDevice = global.__devices.find(({ id }) => id === device.id);

          if (!localDevice) {
            return of({
              id: device.id,
              action_result: {
                status: ActionResultStatus.ERROR,
                error_code: ActionResultErrorCode.DEVICE_NOT_FOUND,
              },
            });
          }

          const _promise = localDevice.performChanges(device.capabilities || []);

          if (_promise instanceof Promise) {
            return from(_promise);
          }

          return of(_promise);
        }),
        reduce<DeviceStateChangeResponse, DeviceStateChangeResponse[]>(
          (acc, val) => acc.concat(val),
          [],
        ),
      )
      .toPromise();

    const response: DeviceActionResponse = {
      request_id,
      payload: {
        // @ts-expect-error kek!
        devices: devicesResponse,
      },
    };

    logResponse(JSON.stringify(response, null, 2));

    return res.json(response);
  }

  return next();
};
