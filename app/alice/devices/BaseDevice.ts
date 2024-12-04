import { CapabilityInterface, DeviceInterface } from '../interfaces';
import { CustomData, DeviceInfo, DeviceStateResponseDevice, DeviceType } from '../types';

export abstract class BaseDevice implements DeviceInterface {
  readonly id: string;
  readonly name: string;
  // @ts-expect-error kek!
  readonly description: string;
  // @ts-expect-error kek!
  readonly room: string;
  readonly type: DeviceType;
  readonly custom_data: CustomData;
  capabilities: Record<string, CapabilityInterface>;
  // @ts-expect-error kek!
  readonly device_info: DeviceInfo;

  constructor(options: { id: string; name: string; type: DeviceType; custom_data?: CustomData }) {
    this.id = options.id;
    this.name = options.name;
    this.type = options.type;
    this.custom_data = options.custom_data || {};
    this.capabilities = {};
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      room: this.room,
      type: this.type,
      custom_data: this.custom_data,
      capabilities: Object.values(this.capabilities).map((c) => c.toJson()),
    };
  }

  getState(): DeviceStateResponseDevice {
    return {
      id: this.id,
      capabilities: Object.values(this.capabilities).map((c) => c.getState()),
    };
  }

  performChanges(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _changes: Parameters<DeviceInterface['performChanges']>[0],
  ): ReturnType<DeviceInterface['performChanges']> {
    throw new Error('notImplemented');
  }
}
