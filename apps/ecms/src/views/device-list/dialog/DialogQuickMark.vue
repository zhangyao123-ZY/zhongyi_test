<!--
 * 二维码扫描-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogQuickMark.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="设备新增"
    width="520"
    append-to-body
    @close="handleCloseEventFn"
  >
    <div
      class="text-base font-normal text-basic-text flex flex-col justify-center items-center py-4 space-y-2"
    >
      <h4>请将设备摄像头对准下方二维码，进行扫描</h4>
      <div class="h-56 w-56">
        <img :src="qrcodeImg" alt="" class="w-full h-full" />
      </div>
      <p>在听到摄像机扫描成功的声音后点击下一步</p>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <el-button @click="handleCloseEventFn">取消</el-button>
        <el-button type="primary" @click="eventSubmitFn"> 下一步 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import { useQRCode } from "@vueuse/integrations/useQRCode";

const customProps = withDefaults(
  defineProps<{
    qrcodeInfoList?: string[];
    // 二维码轮训时长
    qrcodeTime?: number;
  }>(),
  {
    qrcodeTime: 2 * 1000,
  }
);

const customEmits = defineEmits<{
  /**
   * 扫码通知
   */
  (e: "qrcode-notification"): void;
}>();

// 弹窗是否可见
const dialogVisible = defineModel<boolean>("dialogVisible");

// 关闭弹窗
const handleCloseEventFn = () => {
  dialogVisible.value = false;
};

/**
 * 二维码扫描
 */

const qrcodeInfo = ref("");
const qrcodeImg = useQRCode(qrcodeInfo);
const recordIndex = shallowRef(0);

// 2s 轮训生成二维码
useIntervalFn(() => {
  if (customProps.qrcodeInfoList) {
    if (recordIndex.value >= (customProps.qrcodeInfoList?.length - 1)) {
      recordIndex.value = 0;
    } else {
      recordIndex.value = recordIndex.value + 1;
    }
  }
}, customProps.qrcodeTime);

watch(
  recordIndex,
  (newChange) => {
    if (customProps.qrcodeInfoList?.length === 0) return;
    qrcodeInfo.value = customProps.qrcodeInfoList?.[newChange] || "";
  },
  {
    immediate: true,
  }
);
// 扫码完成
const eventSubmitFn = () => {
  customEmits("qrcode-notification");
};
</script>
