<!--
 * 设备名称修改-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogDeviceNameEdit.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="修改设备名称"
    width="400"
    @close="handleCloseEventFn"
  >
    <el-form
      ref="ruleFormRef"
      size="large"
      :model="formData"
      :rules="formDataRules"
      label-width="80px"
      label-position="left"
      class="w-full"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model.trim="formData.deviceName"
          placeholder="请输入设备名称"
          maxlength="40"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="handleCloseEventFn">取消</el-button>
        <el-button type="primary" @click="eventSubmitFn"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, FormInstance } from "element-plus";
import VideIotServer from "videiot-server";

const customProps = defineProps<{
  // 编辑的信息
  editDeviceName?: string;

  // 附属Id(更新编辑时所需)
  auxiliaryConfog: {
    // 设备sn
    deviceSn: string;
    // 通道号 (修改大华设备通道名称时需要传通道号)
    channelId?: number;
  };
}>();
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
 * 表单
 */
const ruleFormRef = ref<FormInstance>();
const formData = reactive({
  // 设备名称
  deviceName: customProps.editDeviceName || "",
});

const formDataRules = {
  deviceName: [
    {
      required: true,
      message: "请输入设备名称",
      trigger: "blur",
    },
  ],
};

/**
 * 更新设备名称
 */
const eventSubmitFn = () => {
  if (customProps.editDeviceName === formData.deviceName) {
    return ElMessage.error("设备名称无修改");
  }
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { deviceSn, channelId } = customProps.auxiliaryConfog!;
      const { resultCode } = await VideIotServer.getInstance().updateDeviceName(
        {
          deviceSn,
          channelId,
          deviceName: formData.deviceName,
        }
      );
      if (resultCode === "0") {
        ElMessage.success("更新设备名称成功");
        customEmits("update-notification");
        // 关闭弹窗
        handleCloseEventFn();
      }
    }
  });
};
</script>
