import {
  ChannelOnlineStatusEnum,
  DeviceOnlineStatusEnum,
  DeviceProtocolSubTypeEnum,
  DeviceTypeEnum,
} from "./basic";

export * from "./basic";

// /**
//  * 设备列表
//  */
// export interface DeviceListInterface {
//   /**
//    * 设备id
//    */
//   deviceSn: string;
//   /**
//    * 设备名称
//    */
//   deviceName: string;
//   /**
//    * 设备类型
//    * protocol=1时返回
//    */
//   deviceType?: DeviceTypeEnum;
//   /**
//    * 设备接入协议
//    */
//   protocol?: DeviceProtocolSubTypeEnum;
//   /**
//    * 设备在线状态
//    */
//   onlineStatus: DeviceOnlineStatusEnum;
//   /**
//    * 是否内网
//    * 1:是，2:否
//    */
//   isIntranet: 1 | 2;
//   /**
//    * 是否绑定下级域
//    * 1:是，2:否
//    */
//   isSubDomain: 1 | 2;

//   /**
//    * 通道列表
//    */
//   channelList?: DeviceChannelListInterface[];
// }

// /**
//  * 通道列表
//  */
// export interface DeviceChannelListInterface {
//   /**
//    * 通道编码
//    * 国标通道返回
//    */
//   channelSn: string;
//   /**
//    * 通道号
//    * 非国标设备的通道返回
//    */
//   channelId?: string;
//   /**
//    * 通道名称
//    */
//   channelName: string;
//   /**
//    * 通道在线状态
//    */
//   onlineStatus: ChannelOnlineStatusEnum;
// }
