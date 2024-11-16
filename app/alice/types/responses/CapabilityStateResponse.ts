import { CapabilityType } from '../CapabilityType';
import { OnOffInstance, RangeInstance, ModeInstance } from '../instances';
import { ModeValue } from '../modes';

export type CapabilityStateResponse =
  | OnOffCapabilityStateResponse
  | RangeCapabilityStateResponse
  | ModeCapabilityStateResponse;

export type OnOffCapabilityStateResponse = {
  type: CapabilityType.OnOff;
  state: {
    instance: OnOffInstance;
    value: boolean;
  };
};

export type RangeCapabilityStateResponse = {
  type: CapabilityType.Range;
  state: {
    instance: RangeInstance;
    value: number;
  };
};

export type ModeCapabilityStateResponse = {
  type: CapabilityType.Mode;
  state: {
    instance: ModeInstance;
    value: ModeValue;
  };
};
