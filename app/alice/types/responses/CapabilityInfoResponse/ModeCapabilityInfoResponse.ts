import { CapabilityType } from '../../CapabilityType';
import { ModeInstance } from '../../instances';
import { ModeThermostatValue } from '../../modes';

export type ModeCapabilityInfoResponse = ModeThermostatCapabilityInfoResponse;

export type ModeThermostatCapabilityInfoResponse = {
  type: CapabilityType.Mode;
  retrievable?: boolean;
  /** Параметры умения */
  parameters: {
    instance: ModeInstance.thermostat;
    /** Массив объектов mode, которые описывают режимы работы функции. Минимальное количество режимов в массиве: 1 */
    modes: {
      /** Значение режима работы функции, обрабатываемое на стороне провайдера */
      value: ModeThermostatValue;
    }[];
  };
};
