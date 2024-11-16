import {
  CapabilityInfoResponse,
  CapabilityInstance,
  CapabilityStateChangeRequest,
  CapabilityStateResponse,
  CapabilityType,
} from '../types';

export interface CapabilityInterface {
  type: CapabilityType;
  instance: CapabilityInstance;
  retrievable?: boolean;

  /**
   * Описание умения
   */
  toJson(): CapabilityInfoResponse;

  /**
   * Текущее состояние умения
   */
  getState(): CapabilityStateResponse;

  /**
   * Изменение состояния умения у устройства
   */
  performChange(c: CapabilityStateChangeRequest): CapabilityStateResponse | void;
}
