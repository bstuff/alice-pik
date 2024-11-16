/**
 * Тип устройства
 */
export enum DeviceType {
  /** Устройство, которое имеет управляемые светящиеся элементы */
  Light = 'devices.types.light',

  /** Розетка */
  Socket = 'devices.types.socket',

  /** Выключатель */
  Switch = 'devices.types.switch',

  /** Устройство с возможностью регулирования температуры */
  Thermostat = 'devices.types.thermostat',

  /** Устройство, управляющее микроклиматом в помещении, с возможностью регулирования температуры и режима работы */
  AC = 'devices.types.thermostat.ac',

  /** Аудио, видео, мультимедиа техника. Устройства, которые умеют воспроизводить звук и видео */
  MediaDevice = 'devices.types.media_device',

  /** Устройство для просмотра видеоконтента. На устройстве можно изменять громкость и переключать каналы */
  TV = 'devices.types.media_device.tv',

  /** Различная умная кухонная техника */
  Cooking = 'devices.types.cooking',

  /** Устройство, которое умеет делать кофе */
  CoffeeMaker = 'devices.types.cooking.coffee_maker',

  /** Устройство, которое умеет кипятить воду и/или делать чай */
  Kettle = 'devices.types.cooking.kettle',

  /** Устройство, которое умеет открываться и/или закрываться */
  Openable = 'devices.types.openable',

  /** Устройство, которое выполняет функцию штор */
  Curtain = 'devices.types.openable.curtain',

  /** Устройство, которое умеет изменять влажность в помещении */
  Humidifier = 'devices.types.humidifier',

  /** Устройство с функцией очистки воздуха */
  Purifier = 'devices.types.purifier',

  /** Устройство, которое выполняет функцию пылесоса */
  VacuumCleaner = 'devices.types.vacuum_cleaner',

  /** Устройство для стирки белья */
  WashingMachine = 'devices.types.washing_machine',

  /** Остальные устройства */
  Other = 'devices.types.other',
}
