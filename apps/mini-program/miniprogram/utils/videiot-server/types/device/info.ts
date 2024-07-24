/**
 * 设备通道信息
 *
 * @export
 * @interface DeviceChannelInfo
 */
export interface DeviceChannelInfo {
  /**
   * 通道编码
   * 国标通道返回
   */
  channelSn?: string;
  /**
   * 通道号
   * 非国标设备的通道返回
   */
  channelId?: number;
  /**
   * 通道名称
   */
  channelName?: string;
  /**
   * 在线状态
   * 0-离线 1-在线 2-休眠
   */
  onlineStatus: number;
  /**
   * 1400通道编码
   */
  gaChannelCode?: string;
}

/**
 * 千里眼设备信息
 *
 * @export
 * @interface QLYDeviceInfo
 */
export interface QLYDeviceInfo {

  /**
   * 固件版本
   * protocol=2返回
   */
  firmwareVersion?: string;

  /**
   * 应用程序版本
   * protocol=2返回
   */
  cameraAppVersion?: string;

  /**
   * 设备imei
   * protocol=2返回
   */
  imei?: string;

  /**
   * 设备moduleId
   * protocol=2返回
   */
  moduleId?: string;
}

/**
 * 国标28181协议
 *
 * @export
 * @interface GB28181DeviceInfo
 */
export interface GB28181DeviceInfo {

  /**
   * 设备类型
   * protocol=1时必传
   * 1-IPC 2-NVR
   */
  deviceType?: number;

  /**
   * SIP服务器ID
   * protocol=1返回
   */
  sipserverID?: string;
  SIPServerID?: string;
  /**
   * SIP服务器域
   * protocol=1返回
   */
  sipserverDomain?: string;
  SIPServerDomain?: string;
  /**
   * SIP服务器IP
   * protocol=1返回
   */
  sipserverIP?: string;
  SIPServerIP?: string;
  /**
   * SIP服务器端口
   * protocol=1返回
   */
  sipserverPort?: string;
  SIPServerPort?: string;
  /**
   * 登录用户名
   * protocol=1返回
   */
  loginName?: string;

  /**
   * 登录密码
   * protocol=1返回 RSA加密
   */
  loginPwd?: string;

  /**
   * 拉流协议
   * 1-TCP 2-2-UDP
   * protocol=1返回 
   */
  pullProtocol?: string;
}

/**
 * 设备信息
 *
 * @export
 * @interface DeviceInfo
 */
export interface DeviceInfo extends GB28181DeviceInfo, QLYDeviceInfo {
  /**
   * 需要删除的设备
   * 
   * deleteType=1时，deviceSn是 NVR会删除改设备下所有通道
   */
  deviceSn: string;

  /**
   * 设备名称
   * 最大40位，默认Camera
   */
  deviceName: string;

  /**
   * 设备接入协议
   * 1-国标28181协议 2-千里眼协议 5-大华私有协议
   */
  protocol: number;

  /**
   * 在线状态
   * 0-离线 1-在线 2-休眠
   */
  onlineStatus?: number;

  /**
   * 通道列表
   */
  channelList?: Array<DeviceChannelInfo>;

  /**
   * 是否内网
   * 1:是，2:否
   */
  isIntranet: number;
  /**
   * 是否绑定下级域
   * 1:是，2:否
   */
  isSubDomain: number;
}

/**
 * 设备列表项
 *
 * @export
 * @interface DeviceListItem
 */
export type DeviceListItem = Pick<
  DeviceInfo,
  'deviceSn' | 'deviceName' | 'protocol' | 'deviceType' | 'channelList' | 'onlineStatus' | 'isIntranet' | 'isSubDomain'
>;

/**
 * 1400 设备信息
 *
 * @export
 * @interface Device1400Info
 */
export interface Device1400Info {
  /**
   * 1400通道编码
   */
  gaChannelCode: string;

  /**
   * 1400账号
   */
  account: string;

  /**
   * 1400密码
   */
  password: string;
  
  /**
   * 接入ip
   */
  ip: string;

  /**
   * 接入端口
   */
  port: string;
}

/**
 * 国标设备接入 信息
 *
 * @export
 * @interface GBDeviceNodeInfo
 */
export interface GBDeviceNodeInfo {

  /**
   * SIP服务器地址 (内网ipv4)
   */
  sipSerIpIntranet: string;
  /**
   * SIP 服务端口 (内网ipv4)
   */
  sipSerPortIntranet: string;
  /**
   * SIP服务器地址 (内网ipv6)
   */
  sipSerIpv6Intranet: string;
  /**
   * SIP 服务端口 (内网ipv6)
   */
  sipSerIpv6PortIntranet: string;
  /**
   * SIP服务器域名 (内网域名)
   */
  sipSerHostIntranet: string;
  /**
   * SIP 服务端口 (内网端口)
   */
  sipSerHostPortIntra: string;
  /**
   * SIP服务器ID
   */
  sipId: string;
  /**
   * SIP服务器域
   */
  sipDomain: string;
  /**
   * SIP服务器域名
   */
  sipHost: string;
  /**
   * SIP服务器域名 端口
   */
  sipHostPort: string;
  /**
   * SIP服务器ipv4
   */
  sipIpv4: string;
  /**
   * SIP服务器ipv4 端口
   */
  sipIpv4Port: string;
  /**
   * SIP服务器ipv6
   */
  sipIpv6: string;
  /**
   * SIP服务器ipv6 端口
   */
  sipIpv6Port: string;
}

/**
 * 私有协议设备 接入信息
 *
 * @export
 * @interface QLYDeviceNodeInfo
 */
export interface QLYDeviceNodeInfo {
  /**
   * 设备网关域名
   */
  host: string;
  /**
   * 设备网关域名 端口
   */
  hostPort: string;
  /**
   * 千里眼私有协 议网关接入地址(ipv4)
   */
  ipv4: string;
  /**
   * 千里眼私有协 议网关接入端 口(ipv4)
   */
  ipv4Port: string;
  /**
   * 千里眼私有协 议网关接入地 址(ipv6)
   */
  ipv6: string;
  /**
   * 千里眼私有协 议网关接入端 口(ipv6)
   */
  ipv6Port: string;
  /**
   * 千里眼私有协 议网关接入域 名(内网域名)
   */
  domainIntranet: string;
  /**
   * 千里眼私有协 议网关接入端 口(内网域名)
   */
  portIntranet: string;
  /**
   * 千里眼私有协 议网关接入地 址(内网ipv4)
   */
  ipv4Intranet: string;
  /**
   * 千里眼私有协 议网关接入端 口(内网ipv4)
   */
  ipv4PortIntranet: string;
  /**
   * 千里眼私有协 议网关接入地 址(内网ipv6)
   */
  Ipv6Intranet: string;
  /**
   * 千里眼私有协 议网关接入端 口(内网ipv6)
   */
  Ipv6PortIntranet: string;
}

/**
 * 设备所在节点信息
 *
 * @export
 * @interface DeviceNodeInfo
 */
export interface DeviceNodeInfo extends GBDeviceNodeInfo, QLYDeviceNodeInfo {
  /**
   * 节点名称
   */
  platformName: string;
  /**
   * 节点状态
   * 1-可用，0-不可 用
   */
  status: string;
}