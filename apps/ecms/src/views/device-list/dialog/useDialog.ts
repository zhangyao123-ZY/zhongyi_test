import { DeviceProtocolSubTypeEnum, DeviceTypeEnum } from "@/types/device";
import {
  DeviceListItem,
  DeviceChannelBody,
  DeviceChannelInfo,
} from "videiot-server/src/types";

/**
 * 设备/通道名称编辑-弹窗
 */
export const useDeviceNameEditDialog = () => {
  const isDialogVisible = ref(false);
  const dialogEditName = ref("");
  const dialogOptions = reactive<{
    deviceSn: string;
    channelId?: number;
  }>({
    deviceSn: "",
  });
  // 打开弹窗
  const eventOpenDialogFn = (
    deviceInfo: DeviceListItem | DeviceChannelBody,
    type: "device" | "channel" = "device",
    // 设备Id(channel 类型时所需)
    deviceId?: string
  ) => {
    if (type === "device") {
      const { deviceName, deviceSn } = deviceInfo as DeviceListItem;
      dialogOptions.deviceSn = deviceSn;
      dialogOptions.channelId = undefined;
      dialogEditName.value = deviceName || "";
    }
    if (type === "channel") {
      const { channelName, channelId } = deviceInfo as DeviceChannelBody;
      dialogOptions.channelId = channelId;
      dialogOptions.deviceSn = deviceId || "";
      dialogEditName.value = channelName || "";
    }

    isDialogVisible.value = true;
  };

  return {
    isDialogVisible,
    dialogEditName,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * 设备删除-弹窗
 */
export const useDeviceDeleteDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    deviceSn: string;
    deviceType: DeviceTypeEnum;
    // 设备协议
    protocol: DeviceProtocolSubTypeEnum;
    // 通道列表
    channelList: DeviceChannelInfo[];
  }>({
    deviceSn: "",
    deviceType: DeviceTypeEnum.IPC,
    protocol: DeviceProtocolSubTypeEnum.gb28181,
    channelList: [],
  });
  // 打开弹窗
  const eventOpenDialogFn = (deviceInfo: DeviceListItem) => {
    const { deviceSn, protocol, deviceType, channelList } = deviceInfo;
    dialogOptions.deviceSn = deviceSn;
    dialogOptions.deviceType = deviceType || DeviceTypeEnum.IPC;
    dialogOptions.protocol = protocol || DeviceProtocolSubTypeEnum.gb28181;
    dialogOptions.channelList = channelList || [];
    isDialogVisible.value = true;
  };
  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * 设备添加-弹窗
 */
export const useDeviceAddDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    deviceSn: string;
  }>({
    deviceSn: "",
  });
  // 打开弹窗
  const eventOpenDialogFn = () => {
    isDialogVisible.value = true;
  };
  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * 设备详情-弹窗
 */
export const useDeviceDetailDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    deviceSn: string;
  }>({
    deviceSn: "",
  });
  // 打开弹窗
  const eventOpenDialogFn = (deviceInfo: DeviceListItem) => {
    const { deviceSn } = deviceInfo;
    dialogOptions.deviceSn = deviceSn;
    isDialogVisible.value = true;
  };
  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * 1400 设备列表展示-弹窗
 */
export const useDevice1400ListDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    channelCode: string;
  }>({
    channelCode: "",
  });
  // 打开弹窗
  const eventOpenDialogFn = (deviceInfo: DeviceChannelInfo) => {
    const { gaChannelCode } = deviceInfo;
    dialogOptions.channelCode = gaChannelCode || "";
    isDialogVisible.value = true;
  };
  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * 1400 设备添加-弹窗
 */
export const useDevice1400AddDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    channelSn: string;
  }>({
    channelSn: "",
  });
  // 打开弹窗
  const eventOpenDialogFn = (deviceInfo: DeviceChannelInfo) => {
    const { channelSn } = deviceInfo;
    dialogOptions.channelSn = channelSn || "";
    isDialogVisible.value = true;
  };
  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * NVR 设备通道列表展示-弹窗
 */
export const useNvrDeviceChannelListDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    deviceSn: string;
    channelList: DeviceChannelInfo[];
    deviceType: DeviceTypeEnum;
  }>({
    deviceSn: "",
    channelList: [],
    deviceType: DeviceTypeEnum.IPC,
  });
  // 打开弹窗
  const eventOpenDialogFn = (deviceInfo: DeviceListItem) => {
    const { deviceSn, channelList, deviceType } = deviceInfo;
    dialogOptions.deviceSn = deviceSn;
    dialogOptions.channelList = channelList?.reverse() || [];
    dialogOptions.deviceType = deviceType || DeviceTypeEnum.IPC;
    isDialogVisible.value = true;
  };

  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * NVR 设备通道添加-弹窗
 */
export const useNvrDeviceChannelAddDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    deviceSn: string;
  }>({
    deviceSn: "",
  });
  // 打开弹窗
  const eventOpenDialogFn = () => {
    // const { channelId, channelSn } = deviceInfo;
    // dialogOptions.deviceSn = channelSn || '';
    isDialogVisible.value = true;
  };
  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * 直播回放-弹窗
 */
export const useLivePlaybackDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    deviceSn: string;
  }>({
    deviceSn: "",
  });
  // 打开弹窗
  const eventOpenDialogFn = () => {
    console.log("打开弹窗");

    isDialogVisible.value = true;
  };

  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};

/**
 * 千里眼设备绑定进度条-弹窗
 */
export const useDeviceProgressDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    deviceSn: string;
    bindType: number
  }>({
    deviceSn: "",
    bindType: 1
  });
  // 打开弹窗
  const eventOpenDialogFn = (options: {
    deviceSn?: string;
    bindType?: number
  }) => {
    const { deviceSn, bindType } = options;
    dialogOptions.deviceSn = deviceSn || '';
    dialogOptions.bindType = bindType || 1;
    isDialogVisible.value = true;
  };
  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};
/**
 * 千里眼设备扫码绑定-弹窗
 */
export const useDeviceScanBindDialog = () => {
  const isDialogVisible = ref(false);
  const dialogOptions = reactive<{
    // 二维码列表
    qrCodeList: string[];
  }>({
    qrCodeList: [],
  });
  // 打开弹窗
  const eventOpenDialogFn = (options: { qrCodeList: string[] }) => {
    const { qrCodeList } = options;
    dialogOptions.qrCodeList = qrCodeList;
    isDialogVisible.value = true;
  };
  return {
    isDialogVisible,
    dialogOptions,
    eventOpenDialogFn,
  };
};
