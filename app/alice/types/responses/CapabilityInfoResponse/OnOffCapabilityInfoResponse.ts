import { CapabilityType } from '../../CapabilityType';

export type OnOffCapabilityInfoResponse = {
  type: CapabilityType.OnOff;
  retrievable?: boolean;
};
