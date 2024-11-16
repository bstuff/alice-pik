export type CapabilityInstance = OnOffInstance | RangeInstance | ModeInstance;

export enum OnOffInstance {
  on = 'on',
}

export enum RangeInstance {
  /** Изменение яркости световых элементов. */
  brightness = 'brightness',

  /** Изменение канала, например телевизионного. */
  channel = 'channel',

  /** Изменение влажности. */
  humidity = 'humidity',

  /** Открывание чего-либо (открывание штор, окна). */
  open = 'open',

  /** Изменение температуры. Может обозначать температуру нагрева чайника, обогревателя или температуру кондиционера в каком-либо его режиме. */
  temperature = 'temperature',

  /** Изменение громкости устройства. */
  volume = 'volume',
}

export enum ModeInstance {
  /** Установка режима уборки. */
  cleanup_mode = 'cleanup_mode',

  /** Установка режима работы кофеварки. */
  coffee_mode = 'coffee_mode',

  /** Установка режима работы скорости вентиляции, например, в кондиционере, вентиляторе или обогревателе. */
  fan_speed = 'fan_speed',

  /** Установка режима нагрева. */
  heat = 'heat',

  /** Установка источника сигнала. */
  input_source = 'input_source',

  /** Установка какой-либо программы работы. */
  program = 'program',

  /** Установка направления воздуха в климатической технике. */
  swing = 'swing',

  /** Установка температурного режима работы климатической техники, например, в кондиционере. */
  thermostat = 'thermostat',

  /** Установка скорости работы. */
  work_speed = 'work_speed',
}
