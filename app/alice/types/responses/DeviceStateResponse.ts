import { DeviceErrorCode } from '../DeviceErrorCode';

import { CapabilityStateResponse } from './CapabilityStateResponse';

export type DeviceStateResponse = {
  /** Идентификатор запроса */
  request_id: string;

  /** Объект с устройствами */
  payload: {
    /** Массив с устройствами пользователя */
    devices: DeviceStateResponseDevice[];
  };
};

export type DeviceStateResponseDevice = {
  /** Идентификатор устройства */
  id: string;

  /** Идентификатор устройства */
  capabilities?: CapabilityStateResponse[];

  /** Код возможной ошибки из списка. Если поле непустое, параметр capabilities будет проигнорирован */
  error_code?: DeviceErrorCode;

  /** Расширенное человекочитаемое описание возможной ошибки. Доступно только в режиме отладки */
  error_message?: string;
};
