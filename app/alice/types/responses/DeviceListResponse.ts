import { CustomData } from '../CustomData';
import { DeviceInfo } from '../DeviceInfo';
import { DeviceType } from '../DeviceType';

import { CapabilityInfoResponse } from './CapabilityInfoResponse';

export type DeviceListResponse = {
  /** Идентификатор запроса */
  request_id: string;

  /** Объект с устройствами */
  payload: {
    /** Идентификатор пользователя */
    user_id: string;

    /** Массив с устройствами пользователя */
    devices: DeviceInfoResponse[];
  };
};

export type DeviceInfoResponse = {
  /** Идентификатор устройства */
  id: string;

  /** Название устройства */
  name?: string;

  /** Описание устройства */
  description?: string;

  /** Название помещения, в котором расположено устройство */
  room?: string;

  /** Тип устройства */
  type: DeviceType;

  custom_data?: CustomData;

  /** Массив с информацией об умениях устройства */
  capabilities?: CapabilityInfoResponse[];

  /** Дополнительная техническая информация об устройстве. Информация выводится в ПП в разделе с настройками устройства. Данная информация поможет быстрее идентифицировать устройство при обращении пользователя в поддержку Яндекса или к производителю. */
  device_info?: Partial<DeviceInfo>;
};
