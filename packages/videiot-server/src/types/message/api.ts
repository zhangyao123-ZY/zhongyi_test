import { MessageTypeEnum } from "./info";

/**
 * 消息订阅请求参数
 */
export interface IMessageSubscribeRequest {
  /**
   * 租户 ID
   */
  appId: string;
  /**
   * 消息类型
   */
  msgType: MessageTypeEnum;
  /**
   * 消息体
   */
  data: MessageBodyType[];
}
/**
 * 消息订阅响应参数
 */
export interface IMessageSubscribeResponse {}

export interface IMessageDevice {
  /**
   * 设备 Sn
   */
  deviceSn: string;

  /**
   * 通道 ID
   */
  channelId?: number;

  /**
   * 发生时间，13位毫秒时间戳
   */
  detectTime: number;
}

/**
 * 在离线消息-消息体
 */
export interface IMessageDeviceOnlineStatus extends IMessageDevice {
  /**
   * 在线状态
   * 1-在线
   * 0-离线
   */
  onlineType: boolean;
}
/**
 * 设备绑定/解绑消息-消息体
 */
export interface IMessageDeviceBind extends IMessageDevice {
  /**
   * 设备 mac
   */
  mac: string;
  /**
   * 绑定状态
   * 1-绑定
   * 0-解绑
   * 2-重新配网绑定消息（设备更换网络后触发的绑定请求，设备所有业务数据不会修改）
   */
  bindType: number;
}

/**
 * 消息体类型
 */
export type MessageBodyType = IMessageDeviceOnlineStatus | IMessageDeviceBind;
