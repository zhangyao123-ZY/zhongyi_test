import { GB28181DeviceInfo } from "./info";

/**
 * 添加设备请求参数
 *
 * @export
 * @interface AddDeviceBody
 */
export interface AddDeviceBody {
  /**
   * 设备接入协议
   * 1-国标28181协议 2-千里眼协议 5-大华私有协议
   */
  protocol: number;

  /**
   * 设备名称
   * 最大40位，默认 Camera
   */
  deviceName?: string;

  /**
   * 设备类型
   * protocol=1时必传
   * 1-IPC 2-NVR
   */
  deviceType?: number;

  /**
   * 通道数量
   * deviceType=2时必传 通道数量
   */
  channelCount?: number;

  /**
   * 设备接入方式
   * protocol=2时必传 1-有线绑定 2-扫码绑定
   */
  loginType?: number;

  /**
   * 设备mac
   * protocol=2时必传
   */
  mac?: string;

  /**
   * wifi名称
   * protocol=2、loginType=2 时必传
   */
  wifiSsid?: string;

  /**
   * wifi密码
   * protocol=2、loginType=2、 security不为0时必传
   */
  wifiPwd?: string;

  /**
   * wifi密码加密方式
   * -1: unknown(未指定， 默认使用wpa/wpa2)
   * 0:open(无密码)
   * 1:wpa;
   * 2:wpa2;
   * 3:wep;
   * 4:wpa/wpa2;
   */
  security?: number;

  /**
   * 是否支持ipv6
   * 1-支持，0-不支持(默认)
   */
  isSupportV6?: string;

  /**
   * 是否内网
   * 1-是，0-否(默认)
   */
  isIntranet?: number;

  /**
   * 设备序列号(添 加成功后，大华 设备使用此序 列号作为 deviceSn)
   * protocol=5时必传
   */
  deviceSerialNo?: string;

  /**
   * 设备账号
   * protocol=5时必传
   */
  deviceUsername?: string;

  /**
   * 设备密码
   * protocol=5时必传
   */
  devicePassword?: string;

  /**
   * 平台id
   * 添加国标设备 (protocol=1)时可指定 添加到哪一个平台
   */
  platformId?: string;

  /**
   * 设备通道列表
   * protocol=5时可选，新增 设备并添加传入的通道 列表，通道号不可重复， 可不连续 示例:[0,1,2,3,4,5]
   */
  channelIdList?: Array<number>;

  /**
   *
   * protocol=5时且为被动添 加协议设备必传
   */
  ip?: string;

  /**
   *
   * protocol=5时且为被动添 加协议设备必传
   */
  port?: string;
}

/**
 * 删除设备请求参数
 *
 * @export
 * @interface DeleteDeviceBody
 */
export interface DeleteDeviceBody {
  /**
   * 删除类型:
   *
   * 1-删除设备(国标IPC/国标 NVR/千里眼设备/大华私有设 备)
   * 2-删除NVR通道/大华私有设 备通道
   */
  deleteType: number;

  /**
   * 需要删除的设备
   *
   * deleteType=1时，deviceSn是 NVR会删除改设备下所有通道
   */
  deviceSn: string;

  /**
   * 通道编码
   *
   * 当deleteType=2时，国标设备必传通道编码
   */
  channelSn?: string;

  /**
   * 不传默认为 0:
   * 0 表示不强制删除
   * 1 表示强制删除
   * 这里的强制删除指，如果设备存在云服务，会 先关闭设备云服务，然后再进 行设备删除操作
   */
  force?: number;

  /**
   * 通道id
   * 当deleteType=2时，删除大华私有设备/多目摄像机的通道时必传
   */
  channelId?: number;
}

/**
 * 添加设备成功的响应
 *
 * @export
 * @interface AddDeviceResponse
 */
export interface AddDeviceResponse
  extends Omit<GB28181DeviceInfo, "deviceType" | "pullProtocol"> {
  /**
   * 设备编码
   * protocol=1返回设备编码，
   * protocol=2、loginType=1 返回设备的mac
   * protocol=2、loginType=2 返回空
   * protocol=5返回小写序列号
   */
  deviceSn: string;

  /**
   * 通道列表
   * protocol=1、deviceType=2 返回
   */
  channelList: Array<string>;

  /**
   * 通道编码
   * protocol=1、deviceType=2 返回
   */
  channelSn: string;

  /**
   * 绑定二维码
   * protocol=2、loginType=2 返回 每张二维码间隔2s轮流展示给设备识别
   */
  qrCode: Array<string>;
}

/**
 * 添加 1400 设备
 *
 * @export
 * @interface AddDevice1400Body
 */
export interface AddDevice1400Body {
  /**
   * 需要关联的通道编码
   */
  channelSn?: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 1400账号
   */
  account: string;

  /**
   * 1400密码
   */
  password: string;
}

/**
 * 添加设备成功的响应
 *
 * @export
 * @interface AddDevice1400Response
 */
export interface AddDevice1400Response {
  /**
   * 1400通道编码
   */
  gaChannelCode: string;

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
 * 获取设备缩略图请求参数
 *
 * @export
 * @interface getDeviceThumbnailBody
 */
export interface getDeviceThumbnailBody {
  /**
   * 设备sn
   * 国标设备仅支持传通道编码
   */
  deviceSn: string;

  /**
   * 历史录像时间轴 上的一个时间 点，格式为13位 毫秒时间戳
   */
  timestamp?: string;

  /**
   * 响应url地址网 络类型
   * 默认2, 1=内网 2=公网
   */
  urlNetworkType?: number;

  /**
   * 缩略图的尺寸大 小的宽度，默认 320
   */
  sizeWidth?: string;

  /**
   * 缩略图的尺寸大 小的高度，默认 320
   */
  sizeHeight?: string;

  /**
   * 缩略图地址的有 效时间(单位 秒)，默认600
   *
   */
  effectiveTime?: number;

  /**
   * 通道号
   * 通道号(从0开 始)，千里眼私 有协议多通道、 大华公有云协议 设备、海康SDK、 ehome 、 ISUP 必 传
   */
  channelId?: number;

  /**
   * 是否使用缓存
   * 0-否
1-是 默认使用(选择 不使用缓存则抓 取实时图片返 回，仅对获取实 时缩略图生效， timeStamp为空)
   */
  useCache?: number;
}

/**
 * 增加的通道信息
 *
 * @interface DeviceChannelBody
 */
export interface DeviceChannelBody {
  /**
   * 通道名称
   * 设备名称只能为 汉字、数字、字 母、特殊符号() ()-_−-_—. 空格，同时 不允许只用符号
   */
  channelName?: string;
  /**
   * 通道对应的mac
   */
  mac?: string;
  /**
   * 通道号
   * 通道号(从0开 始)，千里眼私 有协议多通道、 大华公有云协议 设备、海康SDK、 ehome、ISUP必传
   */
  channelId?: number;
}

/**
 * 设备添加通道请求参数
 *
 * @export
 * @interface CreateDeviceChannelBody
 */
export interface CreateDeviceChannelBody {
  /**
   * 设备sn
   */
  deviceSn: string;
  /**
   *
   */
  channels: Array<DeviceChannelBody>;
}

/**
 * 修改设备名称请求参数
 */
export interface UpdateDeviceNameBody {
  /**
   * 设备sn
   */
  deviceSn: string;
  /**
   * 设备名称
   */
  deviceName: string;
  /**
   * 通道号(修改大华设备通道名称时需要传通道号)
   */
  channelId?: number;
}

/**
 * 设备添加通道响应结果
 *
 * @export
 * @interface CreateDeviceChannelResponse
 */
export interface CreateDeviceChannelResponse {
  /**
   * 设备sn
   */
  channelList: Array<{
    /**
     * 通道名称
     */
    channelName?: string;
    /**
     * 通道编码
     */
    channelSn: string;
  }>;
}
