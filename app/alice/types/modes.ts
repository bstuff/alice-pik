export type ModeValue = ModeThermostatValue;

/**
 * Установка температурного режима работы климатической техники, например, в кондиционере.
 */
export enum ModeThermostatValue {
  /** Автоматический */
  auto = 'auto',

  /** Охлаждение */
  cool = 'cool',

  /** Режим осушения */
  dry = 'dry',

  /** Вентиляция */
  fan_only = 'fan_only',

  /** Обогрев */
  heat = 'heat',

  /** Подогрев, [разогрев, предварительный нагрев, предварительный разогрев] */
  preheat = 'preheat',
}
