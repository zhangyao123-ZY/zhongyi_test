<!--
 * 添加设备-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogDeviceAdd.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="设备新增"
    width="480"
    @close="handleCloseEventFn"
  >
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane name="first" label="国标协议" lazy>
        <el-scrollbar
          v-if="activeName === 'first'"
          max-height="310px"
          class="pr-2.5"
        >
          <GbDeviceAddFormComponent ref="firstRefs" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane name="second" label="千里眼私有协议" lazy>
        <el-scrollbar
          v-if="activeName === 'second'"
          max-height="310px"
          class="pr-2.5"
        >
          <SenriganDeviceAddFormComponent ref="secondRefs" />
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <!-- 千里眼-设备绑定进度条弹窗 -->
    <DialogProgressBarComponent
      v-if="deviceProgressDialogVisible"
      v-model:dialog-visible="deviceProgressDialogVisible"
      :device-id="deviceProgressDialogOptions.deviceSn"
      :bind-type="deviceProgressDialogOptions.bindType"
      @bind-notification="handleDeviceBindProgessEventFn"
    />
    <!-- 千里眼-无线绑定二维码扫码 -->
    <DialogQuickMarkComponent
      v-if="quickMarkDialogVisible"
      v-model:dialog-visible="quickMarkDialogVisible"
      :qrcode-info-list="quickMarkDialogOptions.qrCodeList"
      @qrcode-notification="handleQrCodeEventFn"
    />

    <template #footer>
      <div class="flex justify-end">
        <el-button @click="handleCloseEventFn">取消</el-button>
        <el-button type="primary" @click="eventSubmitFn">
          <span v-if="activeName === 'first'">确认</span>
          <span v-else-if="activeName === 'second'">开始绑定</span>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import GbDeviceAddFormComponent from "../module/GbDeviceAddForm.vue";
import SenriganDeviceAddFormComponent from "../module/SenriganDeviceAddForm.vue";
import DialogProgressBarComponent from "./DialogProgressBar.vue";
import DialogQuickMarkComponent from "./DialogQuickMark.vue";

import { useResultAlertBox } from "@/components/ui/result/useResult";
import { useDeviceProgressDialog, useDeviceScanBindDialog } from "./useDialog";
import VideIotServer from "videiot-server";
import { DeviceProtocolSubTypeEnum } from "@/types/device";
import { ElMessage } from "element-plus";

// const customProps = defineProps<{
//   // 设备Id(设备 Sn)
//   deviceId?: string;
// }>();
const customEmits = defineEmits<{
  // 更新通知
  (e: "update-notification"): void;
}>();
// 弹窗是否可见
const dialogVisible = defineModel<boolean>("dialogVisible");

// 关闭弹窗
const handleCloseEventFn = () => {
  dialogVisible.value = false;
};

/**
 * tab 切换
 */
const activeName = ref<string>("first");

/**
 * 添加设备
 */
const firstRefs = ref();
const secondRefs = ref();

const eventSubmitFn = async () => {
  // 添加国标设备
  if (activeName.value === "first") {
    const formInfo = await firstRefs.value?.getFormData();
    if (formInfo) {
      const {
        deviceName,
        deviceType,
        deviceChannelCount,
        isSupportV6,
        isIntranet,
        platformId,
      } = formInfo;
      const {
        resultCode,
        data: deviceInfo,
        resultMsg,
      } = await VideIotServer.getInstance().addDevice({
        protocol: DeviceProtocolSubTypeEnum.gb28181,
        deviceName,
        deviceType,
        channelCount: deviceChannelCount,
        isSupportV6,
        isIntranet,
        platformId,
      });

      const oRecordStatus = resultCode === "0";
      if (oRecordStatus) {
        customEmits("update-notification");
        handleCloseEventFn();
      } else {
        // 关闭相关提示
        ElMessage.closeAll();
      }

      useResultAlertBox({
        title: "设备新增",
        resultType: oRecordStatus ? "device-info-gb" : "basic-error",
        auxiliaryText: resultMsg || "设备新增失败",
        auxiliaryConfog: deviceInfo,
      });
    }

    return;
  }
  // 绑定千里眼设备
  if (activeName.value === "second") {
    const formInfo = await secondRefs.value?.getFormData();
    if (formInfo) {
      const {
        deviceName,
        loginType,
        deviceMac,
        isSupportV6,
        isIntranet,
        wifiName,
        wifiPassword,
        wifiEncrypt,
      } = formInfo;

      const oPortParam = {
        protocol: DeviceProtocolSubTypeEnum.senrigan,
        deviceName,
        loginType,
        mac: deviceMac,
        isSupportV6,
        isIntranet,
      };
      // 无线模式
      if (loginType === 2) {
        Object.assign(oPortParam, {
          wifiSsid: wifiName,
          wifiPwd: wifiPassword,
          security: wifiEncrypt,
        });
      }
      const { resultCode, data: deviceInfo } =
        await VideIotServer.getInstance().addDevice(oPortParam);
      if (resultCode === "0") {
        console.log("deviceInfo", deviceInfo);
        // 判断是否无线绑定
        if (loginType === 2) {
          quickMarkDeviceMac.value = deviceInfo.deviceSn || deviceMac;
          // 打开二维码扫码弹窗
          quickMarkDialogOpenFn({
            qrCodeList: deviceInfo.qrCode,
          });
        } else {
          deviceProgressDialogOpenFn({
            deviceSn: deviceInfo.deviceSn || deviceMac || "",
            bindType: 1,
          });
        }
      }
    }
    return;
  }
};

/**
 * 千里眼-设备绑定进度条弹窗
 */
const {
  isDialogVisible: deviceProgressDialogVisible,
  dialogOptions: deviceProgressDialogOptions,
  eventOpenDialogFn: deviceProgressDialogOpenFn,
} = useDeviceProgressDialog();
// 监测设备绑定进度
const handleDeviceBindProgessEventFn = (
  type: "unbind" | "binded" | "bindedFali"
) => {
  // 绑定完成
  if (type === "binded") {
    // 通知更新
    customEmits("update-notification");
    // 关闭添加弹窗
    handleCloseEventFn();
  }
};

/**
 * 千里眼-无线绑定二维码扫码
 */
const {
  isDialogVisible: quickMarkDialogVisible,
  dialogOptions: quickMarkDialogOptions,
  eventOpenDialogFn: quickMarkDialogOpenFn,
} = useDeviceScanBindDialog();
// 监测二维码扫码
// 记录无线设备mac
const quickMarkDeviceMac = shallowRef("");
const handleQrCodeEventFn = () => {
  console.log("监测二维码扫码");
  // 打开进度条弹窗
  deviceProgressDialogOpenFn({
    deviceSn: quickMarkDeviceMac.value,
    bindType: 2,
  });
};
</script>
