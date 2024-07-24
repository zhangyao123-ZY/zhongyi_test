<!--
 * 1400 设备添加-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * Dialog1400DeviceAdd.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="添加 1400 设备"
    width="480"
    append-to-body
    @close="handleCloseEventFn"
  >
    <el-form
      ref="ruleFormRef"
      size="large"
      :model="formData"
      :rules="formDataRules"
      label-width="120px"
      class="w-full"
    >
      <el-form-item label="名称" prop="deviceName">
        <el-input
          v-model.trim="formData.deviceName"
          placeholder="请填写名称"
          maxlength="40"
        />
      </el-form-item>
      <el-form-item label="1400 账号" prop="deviceAccount">
        <el-input
          v-model.trim="formData.deviceAccount"
          placeholder="请填写 1400 账号"
        />
      </el-form-item>
      <el-form-item label="1400 密码" prop="devicePassword">
        <div class="absolute -z-50">
          <input type="text" />
          <input type="password" />
        </div>
        <el-input
          v-model.trim="formData.devicePassword"
          type="password"
          show-password
          placeholder="请填写 1400 密码"
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
import { useResultAlertBox } from "@/components/ui/result/useResult";
import { ElMessage, FormInstance } from "element-plus";
import VideIotServer from "videiot-server";

const customProps = defineProps<{
  // 通道 Id
  channelId?: string;
}>();
const customEmits = defineEmits<{
  // 更新通知
  (
    e: "update-notification",
    options: {
      channelId: string;
      channelCode: string;
    }
  ): void;
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
  // 名称
  deviceName: "",
  // 设备账号
  deviceAccount: "",
  // 设备密码
  devicePassword: "",
});
const formDataRules = {
  deviceName: [
    {
      required: true,
      message: "请填写名称",
      trigger: "blur",
    },
  ],
  deviceAccount: [
    {
      required: true,
      message: "请填写 1400 账号",
      trigger: "blur",
    },
  ],
  devicePassword: [
    {
      required: true,
      message: "请填写 1400 密码",
      trigger: "blur",
    },
  ],
};

/**
 * 添加 1400设备
 */
const eventSubmitFn = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { deviceName, deviceAccount, devicePassword } = formData;
      const { resultCode, resultMsg, data } =
        await VideIotServer.getInstance().addDevice1400({
          channelSn: customProps.channelId || "",
          name: deviceName,
          account: deviceAccount,
          password: devicePassword,
        });
      const oRecordStatus = resultCode === "0";
      if (oRecordStatus) {
        const { gaChannelCode } = data;
        customEmits("update-notification", {
          channelCode: gaChannelCode,
          channelId: customProps.channelId || "",
        });
        handleCloseEventFn();
      } else {
        // 关闭相关提示
        ElMessage.closeAll();
      }
      useResultAlertBox({
        title: "添加 1400 设备",
        resultType: oRecordStatus ? "basic-success" : "basic-error",
        auxiliaryText: oRecordStatus
          ? "添加 1400 设备成功"
          : resultMsg || "添加 1400 设备失败",
      });
    }
  });
};
</script>
