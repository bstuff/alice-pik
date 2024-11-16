import { BehaviorSubject, Observable } from 'rxjs';

import { CapabilityInterface } from '../interfaces';
import {
  ActionResultError,
  ActionResultErrorCode,
  CapabilityStateChangeRequest,
  CapabilityType,
  ModeCapabilityInfoResponse,
  ModeCapabilityStateResponse,
  ModeInstance,
  ModeThermostatValue,
} from '../types';

import { BaseCapability } from './BaseCapability';

type ConstructorOptions = {
  modes: ModeThermostatValue[];
};

export class ModeThermostat extends BaseCapability implements CapabilityInterface {
  readonly type = CapabilityType.Mode;
  readonly instance = ModeInstance.thermostat;
  modes: ModeThermostatValue[];

  state$ = new BehaviorSubject<ModeThermostatValue>(ModeThermostatValue.cool);

  constructor(observable: Observable<ModeThermostatValue>, opts: Partial<ConstructorOptions>) {
    super();

    const options = {
      modes: [] as ConstructorOptions['modes'],
      ...opts,
    };

    this.modes = options.modes;

    observable.subscribe((value) => this.state$.next(value));
  }

  /** @inheritdoc */
  getState(): ModeCapabilityStateResponse {
    return {
      type: this.type,
      state: {
        instance: this.instance,
        value: this.state$.value,
      },
    };
  }

  /** @inheritdoc */
  toJson(): ModeCapabilityInfoResponse {
    return {
      type: this.type,
      retrievable: true,
      parameters: {
        instance: ModeInstance.thermostat,
        modes: this.modes.map((value) => ({ value })),
      },
    };
  }

  /** @inheritdoc */
  performChange(change: CapabilityStateChangeRequest): ModeCapabilityStateResponse | void {
    if (change.type !== this.type) {
      return;
    }

    if (change.state.instance !== this.instance) {
      return;
    }

    if (!this.modes.includes(change.state.value)) {
      throw new ActionResultError(ActionResultErrorCode.INVALID_VALUE);
    }

    return {
      type: this.type,
      state: {
        instance: this.instance,
        value: change.state.value,
      },
    };
  }
}
