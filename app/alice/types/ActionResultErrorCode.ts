export enum ActionResultErrorCode {
  /** Устройство недоступно */
  DEVICE_UNREACHABLE = 'DEVICE_UNREACHABLE',

  /** Устройство занято каким-либо действием */
  DEVICE_BUSY = 'DEVICE_BUSY',

  /** Устройство не найдено */
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',

  /** Неизвестная ошибка */
  INTERNAL_ERROR = 'INTERNAL_ERROR',

  /** Команда неприменима к устройству */
  INVALID_ACTION = 'INVALID_ACTION',

  /** Значение неприменимо к умению устройства */
  INVALID_VALUE = 'INVALID_VALUE',

  /** Изменение значения умения не поддерживается в текущем режиме (например, просьба включить зеленый цвет, когда лампочка выключена) */
  NOT_SUPPORTED_IN_CURRENT_MODE = 'NOT_SUPPORTED_IN_CURRENT_MODE',
}
