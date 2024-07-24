<!--
 * 国标设备添加表单
 * @author: web_develop
 * @since: 2024-07-18
 * GbDeviceAddForm.vue
-->
<template>
  <el-form
    ref="ruleFormRef"
    size="large"
    :model="formData"
    :rules="formDataRules"
    label-width="120px"
    class="w-full"
  >
    <el-form-item label="设备名称" prop="deviceName">
      <el-input
        v-model.trim="formData.deviceName"
        placeholder="请填写设备名称"
        maxlength="40"
      />
    </el-form-item>
    <el-form-item label="设备类型" prop="deviceType">
      <SelectLayout
        v-model="formData.deviceType"
        :select-option="DeviceTypeOptions"
        :config-attributes="{
          label: 'name',
          value: 'value',
        }"
      />
    </el-form-item>
    <el-form-item
      v-if="formData.deviceType === DeviceTypeEnum.NVR"
      label="通道数量"
      prop="deviceChannelCount"
    >
      <el-input
        v-model.number="formData.deviceChannelCount"
        placeholder="请填写通道数量"
        maxlength="40"
      />
    </el-form-item>

    <el-form-item label="是否支持 ipv6">
      <SelectLayout
        v-model="formData.isSupportV6"
        :select-option="[
          {
            label: '支持',
            value: 1,
          },
          {
            label: '不支持',
            value: 0,
          },
        ]"
      />
    </el-form-item>

    <el-form-item label="是否内网">
      <SelectLayout
        v-model="formData.isIntranet"
        :select-option="[
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 0,
          },
        ]"
      />
    </el-form-item>

    <el-form-item label="平台 Id">
      <el-input
        v-model.trim="formData.platformId"
        placeholder="请填写平台 Id"
      />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import SelectLayout from "@/components/layout/SelectLayout.vue";
import { DeviceTypeOptions } from "@/hooks/options/device-list";
import { DeviceTypeEnum } from "@/types/device";

import { FormInstance } from "element-plus";

/**
 * 表单
 */
const ruleFormRef = ref<FormInstance>();
const formData = reactive({
  // 名称
  deviceName: "",
  // 设备类型
  deviceType: DeviceTypeEnum.IPC,
  // NVR 设备时需要填写通道数量
  deviceChannelCount: null as number | null,
  // 是否支持 ipv6 (0:不支持,1:支持)
  isSupportV6: 0,
  // 是否内网(0:否,1:是)
  isIntranet: 0,
  // 平台 Id
  platformId: "",
});
const formDataRules = {
  deviceName: [
    {
      required: true,
      message: "请填写设备名称",
      trigger: "blur",
    },
  ],
  deviceChannelCount: [
    {
      required: true,
      message: "请填写通道数量",
      trigger: "blur",
    },
    {
      type: "number",
      message: "请填写正确的通道数量",
    },
  ],
};

// 获取并校验表单信息
const getFormData = () => {
  return new Promise<any>((resolve, reject) => {
    ruleFormRef.value?.validate((valid: boolean) => {
      if (valid) {
        resolve(readonly(formData));
      }
      reject(null);
    });
  });
};

defineExpose({
  getFormData,
});
</script>
