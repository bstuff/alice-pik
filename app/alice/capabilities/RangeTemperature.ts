import { BehaviorSubject, Observable } from 'rxjs';

import { CapabilityInterface } from '../interfaces';
import {
  CapabilityStateChangeRequest,
  CapabilityType,
  RangeCapabilityInfoResponse,
  RangeCapabilityStateResponse,
  RangeInstance,
} from '../types';

import { BaseCapability } from './BaseCapability';

type ConstructorOptions = {
  range: {
    min?: number;
    max?: number;
    precision?: number;
  };
};

export class RangeTemperature extends BaseCapability implements CapabilityInterface {
  readonly type = CapabilityType.Range;
  readonly instance = RangeInstance.temperature;
  unit = 'unit.temperature.celsius';
  random_access = true;
  range: {
    min?: number;
    max?: number;
    precision?: number;
  };

  state$ = new BehaviorSubject({
    instance: RangeInstance.temperature,
    value: 0,
  });

  constructor(observable: Observable<number>, options: Partial<ConstructorOptions> = {}) {
    super();

    const range = options.range || {};
    this.range = range;

    observable.subscribe((res) => this.setValue(res));
  }

  getState(): RangeCapabilityStateResponse {
    return {
      type: this.type,
      state: this.state$.value,
    };
  }

  /** @inheritdoc */
  toJson(): RangeCapabilityInfoResponse {
    return {
      type: this.type,
      retrievable: true,
      parameters: {
        instance: RangeInstance.temperature,
        unit: this.unit,
        range: this.range,
      },
    };
  }

  setValue(val: number) {
    this.state$.next({
      instance: RangeInstance.temperature,
      value: val,
    });
  }

  performChange(change: CapabilityStateChangeRequest): RangeCapabilityStateResponse | void {
    if (change.type !== this.type) {
      return;
    }

    if (change.state.instance !== this.instance) {
      return;
    }

    return {
      type: this.type,
      state: {
        instance: this.instance,
        value: change.state.relative
          ? change.state.value + this.state$.value.value
          : change.state.value,
      },
    };
  }
}
