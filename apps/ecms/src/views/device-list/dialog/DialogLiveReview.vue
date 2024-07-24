<!--
 * 直播回看-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogLiveReview.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="直播回看"
    fullscreen
    append-to-body
    class="custom_iframe_dialog"
    @close="handleCloseEventFn"
  >
    <iframe
      height="100%"
      width="100%"
      :src="customProps.iframeSrc"
    ></iframe>
  </el-dialog>
</template>
<script lang="ts" setup>
const customProps = withDefaults(
  defineProps<{
    // 设备Id(设备 Sn)
    deviceId?: string;
    iframeSrc?: string;
  }>(),
  {
    iframeSrc: "https://open.cmviot.cn/websdk/2.14.0/demo.html",
  }
);

// 弹窗是否可见
const dialogVisible = defineModel<boolean>("dialogVisible");

// 关闭弹窗
const handleCloseEventFn = () => {
  dialogVisible.value = false;
};
</script>

<style lang="scss">
.custom_iframe_dialog {
  @apply flex flex-col;
  > .el-dialog__body {
    @apply flex-1;
  }
}
</style>