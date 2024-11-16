import { CapabilityType } from '../../CapabilityType';
import { RangeInstance } from '../../instances';

export type RangeCapabilityInfoResponse = RangeTemperatureCapabilityInfoResponse;

export type RangeTemperatureCapabilityInfoResponse = {
  type: CapabilityType.Range;
  retrievable?: boolean;
  /** Параметры умения */
  parameters: {
    instance: RangeInstance.temperature;
    unit: Any;
    random_access?: boolean;
    range?: {
      min?: number;
      max?: number;
      precision?: number;
    };
  };
};
