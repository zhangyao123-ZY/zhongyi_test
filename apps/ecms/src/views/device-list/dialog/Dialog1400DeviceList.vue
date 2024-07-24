<!--
 * 1400设备列表-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * Dialog1400DeviceList.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="1400 设备接入信息"
    width="480"
    append-to-body
    @close="handleCloseEventFn"
  >
    <el-scrollbar max-height="380px">
      <el-descriptions :column="1" border size="large" class="pt-4 px-4">
        <el-descriptions-item
          v-for="info in deviceChannelInfoContent"
          :key="info.label"
          :label="info.label"
          label-align="right"
        >
          <span> {{ info.value }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-scrollbar>
  </el-dialog>
</template>
<script lang="ts" setup>
import VideIotServer from "videiot-server";
import { Device1400Info } from "videiot-server/src/types";

const customProps = defineProps<{
  // 1400 通道编码
  channelCode?: string;
}>();
// 弹窗是否可见
const dialogVisible = defineModel<boolean>("dialogVisible");

// 关闭弹窗
const handleCloseEventFn = () => {
  dialogVisible.value = false;
};

const isLoading = ref(false);
const deviceChannelInfo = shallowRef<Device1400Info>();
// 页面
const deviceChannelInfoContent = computed(() => {
  const { gaChannelCode, account, password, ip, port } =
    deviceChannelInfo.value || {};

  return [
    {
      label: "1400 通道编码",
      value: gaChannelCode,
    },
    {
      label: "接入账号",
      value: account,
    },
    {
      label: "接入密码",
      value: password,
    },
    {
      label: "接入 IP",
      value: ip,
    },
    {
      label: "接入端口",
      value: port,
    },
  ];
});

// 获取 1400 通道信息
const eventGetDeviceInfoFn = async () => {
  isLoading.value = true;
  const { resultCode, data } = await VideIotServer.getInstance()
    .getDevice1400Info(customProps.channelCode!)
    .finally(() => {
      isLoading.value = false;
    });
  if (resultCode === "0") {
    deviceChannelInfo.value = data;
  }
};
onMounted(() => {
  eventGetDeviceInfoFn();
});
</script>
