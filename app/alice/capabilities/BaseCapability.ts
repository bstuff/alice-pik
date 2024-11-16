import { CapabilityInterface } from '../interfaces';
import { CapabilityType, CapabilityStateResponse, CapabilityInfoResponse } from '../types';

// @ts-expect-error kek!
export abstract class BaseCapability implements CapabilityInterface {
  // @ts-expect-error kek!

  readonly type: CapabilityType;
  readonly retrievable: boolean = true;

  toJson(): CapabilityInfoResponse {
    return {
      // @ts-expect-error kek!
      type: this.type,
      retrievable: this.retrievable,
    };
  }

  getState(): CapabilityStateResponse {
    return {} as Any;
  }
}
