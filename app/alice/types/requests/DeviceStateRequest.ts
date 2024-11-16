import { CustomData } from '../CustomData';

export type DeviceStateRequest = {
  devices: [
    {
      id: string;
      custom_data?: CustomData;
    },
  ];
};
