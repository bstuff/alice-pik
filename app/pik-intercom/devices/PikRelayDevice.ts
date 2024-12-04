import { of } from 'rxjs';
import {
  ActionResultErrorCode,
  ActionResultStatus,
  BaseDevice,
  DeviceErrorCode,
  DeviceInterface,
  DeviceStateChangeResponse,
  DeviceStateResponseDevice,
  DeviceType,
  OnOff,
} from '~/alice';
import { PikRelay } from '../utils/types';
import { unlockRelay } from '../utils/unlockRelay';

export type PikDeviceCustomData = {
  _provider: 'pik';
  type: 'relay';
};

export class PikRelayDevice extends BaseDevice {
  declare readonly custom_data: PikDeviceCustomData;
  relayId: number = 0;
  authHeader: string = '';

  static fromPikRelay(relay: PikRelay): PikRelayDevice {
    const door = new PikRelayDevice({
      id: `pik:relay:${relay.id}`,
      name: relay.name,
      type: DeviceType.Openable,
      custom_data: {
        _provider: 'pik',
        type: 'relay',
      },
    });
    door.relayId = relay.id;
    door.capabilities.onOff = new OnOff(of(false), { retrievable: false });
    return door;
  }

  getState(): DeviceStateResponseDevice {
    if (!this.authHeader) {
      return {
        id: this.id,
        error_code: DeviceErrorCode.DEVICE_UNREACHABLE,
      }
    }

    return super.getState();
  }

  async performChanges(
    changes: Parameters<DeviceInterface['performChanges']>[0],
  ): Promise<DeviceStateChangeResponse> {
    try {
      await unlockRelay(this.authHeader, this.relayId);
    } catch (error) {
      return {
        id: this.id,
        action_result: {
          status: ActionResultStatus.ERROR,
          error_code: ActionResultErrorCode.DEVICE_UNREACHABLE,
        },
      };
    }

    return {
      id: this.id,
      capabilities: changes.map((it) => {
        it.state;

        return {
          type: it.type,
          state: {
            instance: it.state.instance,
            action_result: {
              status: ActionResultStatus.DONE,
            },
          },
        };
      }),
    };
  }
}
