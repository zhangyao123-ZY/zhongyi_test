/**
 * 设备接入协议
 * 1-国标28181协议
 * 2-千里眼协议
 * 5-大华私有协议
 * 6-ISUP
 * 7-EHome
 * 8-海康私有协议
 */
export enum DeviceProtocolSubTypeEnum {
  /**
   * 国标28181协议
   */
  gb28181 = 1,
  /**
   * 千里眼协议
   */
  senrigan,
  /**
   * 大华私有协议
   */
  dahua = 5,
  /**
   * ISUP协议
   */
  isup,
  /**
   * EHome协议
   */
  ehome,
  /**
   * 海康私有协议
   */
  hikvision,
}

/**
 * 设备类型
 * 1-IPC
 * 2-NVR
 */
export enum DeviceTypeEnum {
  /**
   * IPC
   */
  IPC = 1,
  /**
   * NVR
   */
  NVR,
}

/**
 * 通道在线状态
 * 0-离线
 * 1-在线
 * 2-休眠
 */
export enum ChannelOnlineStatusEnum {
  /**
   * 离线
   */
  offline = 0,
  /**
   * 在线
   */
  online = 1,
  /**
   * 休眠
   */
  sleeping = 2,
}
/**
 * 设备在线状态
 * 0-离线
 * 1-在线
 * 2-休眠
 */
export enum DeviceOnlineStatusEnum {
  /**
   * 离线
   */
  offline = 0,
  /**
   * 在线
   */
  online = 1,
  /**
   * 休眠
   */
  sleeping = 2,
}
