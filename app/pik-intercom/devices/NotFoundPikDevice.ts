import {
  ActionResultErrorCode,
  ActionResultStatus,
  BaseDevice,
  DeviceErrorCode,
  DeviceStateChangeResponse,
  DeviceStateResponseDevice,
  DeviceType,
} from '~/alice';
import { PikDeviceCustomData } from './PikRelayDevice';

export class NotFoundPikDevice extends BaseDevice {
  declare readonly custom_data: PikDeviceCustomData;
  relayId: number = 0;
  authHeader: string = '';

  static fromId(id: number): NotFoundPikDevice {
    const door = new NotFoundPikDevice({
      id: `pik:relay:${id}`,
      name: 'relay.name',
      type: DeviceType.Openable,
      custom_data: {
        _provider: 'pik',
        type: 'relay',
      },
    });
    door.relayId = id;
    return door;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async performChanges(_changes: Any): Promise<DeviceStateChangeResponse> {
    return {
      id: this.id,
      action_result: {
        status: ActionResultStatus.ERROR,
        error_code: ActionResultErrorCode.DEVICE_NOT_FOUND,
      },
    };
  }

  getState(): DeviceStateResponseDevice {
    return {
      id: this.id,
      error_code: DeviceErrorCode.DEVICE_NOT_FOUND,
      error_message: 'Устройство было отвязано'
    };
  }
}
