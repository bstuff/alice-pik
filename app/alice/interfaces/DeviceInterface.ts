import {
  CapabilityStateChangeRequest,
  CustomData,
  DeviceInfo,
  DeviceInfoResponse,
  DeviceStateResponseDevice,
  DeviceType,
  DeviceStateChangeResponse,
} from '../types';

import { CapabilityInterface } from './CapabilityInterface';

export interface DeviceInterface {
  id: string;
  name: string;
  description: string;
  room: string;
  type: DeviceType;
  custom_data: CustomData;
  capabilities: Record<string, CapabilityInterface>;
  device_info: DeviceInfo;

  toJson(): DeviceInfoResponse;
  getState(): DeviceStateResponseDevice;
  performChanges(
    changes: CapabilityStateChangeRequest[],
  ): DeviceStateChangeResponse | Promise<DeviceStateChangeResponse>;
}
