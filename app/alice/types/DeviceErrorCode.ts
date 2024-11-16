export enum DeviceErrorCode {
  /** Устройство недоступно */
  DEVICE_UNREACHABLE = 'DEVICE_UNREACHABLE',

  /** Устройство занято каким-лбо действием. */
  DEVICE_BUSY = 'DEVICE_BUSY',

  /** Устройство не найдено */
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',

  /** Неизвестная ошибка */
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
