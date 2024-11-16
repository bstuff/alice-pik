import { ActionResultErrorCode } from '../ActionResultErrorCode';
import { ActionResultStatus } from '../ActionResultStatus';
import { CapabilityType } from '../CapabilityType';

import { CapabilityStateResponse } from './CapabilityStateResponse';

export type DeviceActionResponse = {
  /** Идентификатор запроса */
  request_id: string;

  /** Объект с устройствами */
  payload: {
    /** Массив с устройствами пользователя */
    devices: DeviceStateChangeResponse[];
  };
};

export type DeviceStateChangeResponse = DeviceIdProp &
  (DeviceStateChangeResponseSuccessPart | DeviceStateChangeResponseErrorPart);

type DeviceIdProp = {
  /** Идентификатор устройства */
  id: string;
};

export type DeviceStateChangeResponseSuccessPart = {
  capabilities: {
    type: CapabilityType;
    state: {
      instance: CapabilityStateResponse['state']['instance'];
      action_result:
        | {
            status: ActionResultStatus.DONE;
          }
        | {
            status: ActionResultStatus.ERROR;
            error_code: ActionResultErrorCode;
            error_message: string;
          };
    };
  }[];
};

export type DeviceStateChangeResponseErrorPart = {
  action_result: {
    status: ActionResultStatus.ERROR;
    error_code: ActionResultErrorCode;
  };
};
