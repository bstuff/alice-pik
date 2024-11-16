import { CapabilityType } from '../CapabilityType';
import { CustomData } from '../CustomData';
import { ModeInstance, OnOffInstance, RangeInstance } from '../instances';
import { ModeValue } from '../modes';

export type StateChangeRequest = {
  /** Объект с устройствами */
  payload: {
    /** Массив с устройствами пользователя */
    devices: [
      {
        /** Идентификатор устройства */
        id: string;

        /** Объект, который провайдер прислал вместе с устройством в ответ на запрос Информация об устройствах пользователя. Состоит из набора пар "ключ":"значение" любой вложенности и представляет собой дополнительную информацию об устройстве. Содержимое объекта не должно превышать 1024 байт */
        custom_data?: CustomData;

        /** Массив с информацией об умениях устройства */
        capabilities?: CapabilityStateChangeRequest[];
      },
    ];
  };
};

export type CapabilityStateChangeRequest =
  | ModeCapabilityActionRequest
  | OnOffCapabilityActionRequest
  | RangeCapabilityActionRequest;

export type OnOffCapabilityActionRequest = {
  type: CapabilityType.OnOff;
  state: {
    instance: OnOffInstance;
    value: boolean;
  };
};

export type RangeCapabilityActionRequest = {
  type: CapabilityType.Range;
  state: {
    instance: RangeInstance;
    relative?: boolean;
    value: number;
  };
};

export type ModeCapabilityActionRequest = {
  type: CapabilityType.Mode;
  state: {
    instance: ModeInstance;
    value: ModeValue;
  };
};
