import { ModeCapabilityInfoResponse } from './ModeCapabilityInfoResponse';
import { OnOffCapabilityInfoResponse } from './OnOffCapabilityInfoResponse';
import { RangeCapabilityInfoResponse } from './RangeCapabilityInfoResponse';

export type CapabilityInfoResponse =
  | OnOffCapabilityInfoResponse
  | RangeCapabilityInfoResponse
  | ModeCapabilityInfoResponse;

export * from './ModeCapabilityInfoResponse';
export * from './OnOffCapabilityInfoResponse';
export * from './RangeCapabilityInfoResponse';
