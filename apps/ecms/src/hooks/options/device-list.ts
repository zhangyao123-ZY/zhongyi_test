/**
 * 设备列表-相关定义
 */

import {
  ChannelOnlineStatusEnum,
  DeviceOnlineStatusEnum,
  DeviceProtocolSubTypeEnum,
  DeviceTypeEnum,
} from "@/types/device";

// 设备列表-面包屑
export const DeviceBreadcrumbOptions = [
  // {
  //     name: "首页",
  //   },
  {
    name: "设备列表",
  },
];

// 设备接入协议
export const DeviceProtocolOptions = [
  {
    name: "国标 28181 协议",
    value: DeviceProtocolSubTypeEnum.gb28181,
  },
  {
    name: "千里眼协议",
    value: DeviceProtocolSubTypeEnum.senrigan,
  },
  {
    name: "大华私有协议",
    value: DeviceProtocolSubTypeEnum.dahua,
  },
  {
    name: "ISUP 协议",
    value: DeviceProtocolSubTypeEnum.isup,
  },
  {
    name: "EHome 协议",
    value: DeviceProtocolSubTypeEnum.ehome,
  },
  {
    name: "海康私有协议",
    value: DeviceProtocolSubTypeEnum.hikvision,
  },
];

// 设备拉流协议
export const DevicePullStreamProtocolOptions = [
  {
    name: "TCP",
    value: 1,
  },
  {
    name: "UDP",
    value: 2,
  },
];

// 设备类型
export const DeviceTypeOptions = [
  {
    name: "IPC",
    value: DeviceTypeEnum.IPC,
  },
  {
    name: "NVR",
    value: DeviceTypeEnum.NVR,
  },
];

// 设备在线状态
export const DeviceOnlineStatusOptions = [
  {
    name: "在线",
    value: DeviceOnlineStatusEnum.online,
    textType: "success",
  },
  {
    name: "离线",
    value: DeviceOnlineStatusEnum.offline,
    textType: "danger",
  },
  {
    name: "休眠",
    value: DeviceOnlineStatusEnum.sleeping,
    textType: "warning",
  },
];

// 设备通道在线状态
export const DeviceChannelOnlineStatusOptions = [
  {
    name: "在线",
    value: ChannelOnlineStatusEnum.online,
    textType: "success",
  },
  {
    name: "离线",
    value: ChannelOnlineStatusEnum.offline,
    textType: "danger",
  },
  {
    name: "休眠",
    value: ChannelOnlineStatusEnum.sleeping,
    textType: "warning",
  },
];

// 设备节点状态 1-可用，0-不可用
export const DeviceNodeStatusOptions = [
  {
    name: "可用",
    value: 1,
    textType: "success",
  },
  {
    name: "不可用",
    value: 0,
    textType: "danger",
  },
];

// 设备删除时选择的删除类型
export const DeviceDeleteTypeOptions = [
  {
    label: "删除设备（国标 IPC/国标 NVR/千里眼设备/大华私有设备）",
    value: 1,
  },
  {
    label: "删除 NVR 通道/大华私有设备通道",
    value: 2,
  },
];

// 设备删除选择是否强制删除
export const DeviceDeleteForceOptions = [
  {
    label: "不强制删除",
    value: 0,
  },
  {
    label: "强制删除",
    value: 1,
  },
];

// wifi 加密方式
export const WifiEncryptOptions = [
  {
    label: "无密码",
    value: 0,
  },
  {
    label: "wpa",
    value: 1,
  },
  {
    label: "wpa2",
    value: 2,
  },
  {
    label: "wep",
    value: 3,
  },
  {
    label: "wpa/wpa2",
    value: 4,
  },
];
// wifi 加密类型
export const WifiEncryptionTypeOptions = [
  {
    name: "开放式",
    value: 0,
  },
  {
    name: "共享式",
    value: 1,
  },
];
