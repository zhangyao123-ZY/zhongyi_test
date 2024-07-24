<!--
 * 进度条-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogProgressBar.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="设备新增"
    width="520"
    append-to-body
    @close="handleCloseEventFn"
  >
    <div class="py-4 px-5 space-y-2">
      <h4 class="text-2xl text-basic-text font-normal text-center">
        正在绑定...
      </h4>
      <el-progress :percentage="percentageNum" :stroke-width="10">
        <span class="ml-7 text-xl text-basic-text w-14 inline-block"
          >{{ percentageNum }}%</span
        >
      </el-progress>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <el-button type="primary" @click="handleCloseEventFn">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useResultAlertBox } from "@/components/ui/result/useResult";
// import { piniaUserRecord } from "@/store/modules/user";
import { useIntervalFn } from "@vueuse/core";
import { getRandomArray } from "@/utils";
import VideIotServer from "videiot-server";
// import VideIotServer from "videiot-server";
// import { IMessageDeviceBind, MessageTypeEnum } from "videiot-server/src/types";

const customProps = withDefaults(
  defineProps<{
    // 设备Id(设备 Sn)
    deviceId?: string;
    // 千里眼设备有限/无线绑定
    bindType?: number;

    // 进度条加载时间(默认两分钟加载完成)
    progressTime?: number;
  }>(),
  {
    progressTime: (1.5 * 60 * 1000) / 100,
  }
);
const customEmits = defineEmits<{
  /**
   * 绑定通知
   * unbind 取消绑定
   * binded 绑定成功
   * bindedFali 绑定失败
   */
  (e: "bind-notification", type: "unbind" | "binded" | "bindedFali"): void;
}>();
// 弹窗是否可见
const dialogVisible = defineModel<boolean>("dialogVisible");

// 关闭弹窗
const handleCloseEventFn = (isUnbind: boolean = true) => {
  if (isUnbind) {
    // 取消绑定
    customEmits("bind-notification", "unbind");
  }
  dialogVisible.value = false;
};

/**
 * 进度条
 */
const percentageNum = ref(0);
// 进度随机卡顿(多次随机卡顿)
// const percentageKartun = getRandomInt(1, 70);
const percentageKartun = getRandomArray({
  count: 3,
  min: 10,
  max: 90,
});


const { pause, resume } = useIntervalFn(() => {
  if (percentageKartun.includes(percentageNum.value)) {
    // 卡顿 4s
    pause();
    setTimeout(() => {
      percentageNum.value += 1;
      resume();
    }, 4 * 1000);
    return;
  }
  percentageNum.value += 1;
  // 进度条加载完成
  if (percentageNum.value >= 98) {
    // 暂停进度条
    pause();
    eventBindSuccessFn();
  }
}, customProps.progressTime);

// 进度条100%时通知绑定完成，并关闭弹窗
const eventBindSuccessFn = async () => {
  const { resultCode } = await VideIotServer.getInstance().getDeviceInfo(customProps.deviceId!)
  const oRecordStatus = resultCode === "0";
  if (oRecordStatus) {
    customEmits("bind-notification", "binded");
  } else {
    customEmits("bind-notification", "bindedFali");
    // 关闭相关提示
    ElMessage.closeAll();
  }
  handleCloseEventFn(false);
  // 千里眼设备有限绑定
  if (customProps.bindType === 1) {
    useResultAlertBox({
      title: "设备新增",
      resultType: oRecordStatus ? "device-info-senrigan" : "basic-error",
      auxiliaryText: "设备新增失败",
      auxiliaryConfog: {
        // 设备 mac
        // deviceMac: "",
        // 设备编码
        deviceCode: customProps.deviceId || "",
      },
    });
    return;
  }
  // 千里眼无线绑定
  if (customProps.bindType === 2) {
    useResultAlertBox({
      title: "设备新增",
      resultType: oRecordStatus ? "basic-success" : "basic-error",
      auxiliaryText: oRecordStatus ? "设备新增成功" : "设备新增失败",
    });
  }
};
</script>
