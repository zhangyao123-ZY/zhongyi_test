<!--
 * 千里眼设备添加表单
 * @author: web_develop
 * @since: 2024-07-18
 * SenriganDeviceAddForm.vue
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
    <el-form-item label="设备接入方式" prop="loginType">
      <SelectLayout
        v-model="formData.loginType"
        :select-option="[
          {
            label: '有线绑定',
            value: 1,
          },
          {
            label: '无线绑定',
            value: 2,
          },
        ]"
      />
    </el-form-item>
    <el-form-item label="设备 mac" prop="deviceMac">
      <el-input
        v-model.trim="formData.deviceMac"
        placeholder="请填写设备 mac"
      />
    </el-form-item>
    <template v-if="formData.loginType === 2">
      <el-form-item label="wifi 名称" prop="wifiName">
        <el-input
          v-model.trim="formData.wifiName"
          placeholder="请填写 wifi 名称"
        />
      </el-form-item>
      <el-form-item label="wifi 密码" prop="wifiPassword">
        <!-- 隐藏式密码自动填充 -->
        <div class="absolute -z-50">
          <input type="text" />
          <input type="password" />
        </div>

        <el-input
          v-model.trim="formData.wifiPassword"
          type="password"
          placeholder="请填写 wifi 密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="wifi 加密方式" prop="wifiEncrypt">
        <SelectLayout
          v-model="formData.wifiEncrypt"
          :select-option="WifiEncryptOptions"
        />
      </el-form-item>
    </template>

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
  </el-form>
</template>
<script lang="ts" setup>
import SelectLayout from "@/components/layout/SelectLayout.vue";
import { WifiEncryptOptions } from "@/hooks/options/device-list";

import { FormInstance } from "element-plus";

/**
 * 表单
 */
const ruleFormRef = ref<FormInstance>();
const formData = reactive({
  // 名称
  deviceName: "",
  // 设备接入方式，默认有线
  loginType: 2,
  // 设备 mac
  deviceMac: "",
  // deviceMac: "906A94292CF8",
  // deviceMac: "906A94292CED",

  // 是否支持 ipv6(0:不支持,1:支持)
  isSupportV6: 0,
  // 是否内网(0:否,1:是)
  isIntranet: 0,

  /** 设备无线接入时填写 wifi */
  wifiName: "",
  wifiPassword: "",
  // wifiName: "HiWiFi_612FA2",
  // wifiPassword: "dync123456",
  wifiEncrypt: 4,
});
const formDataRules = {
  deviceName: [
    {
      required: true,
      message: "请填写设备名称",
      trigger: "blur",
    },
  ],
  loginType: [
    {
      required: true,
      message: "请选择设备接入方式",
      trigger: "change",
    },
  ],
  deviceMac: [
    {
      required: true,
      message: "请填写设备 mac",
      trigger: "blur",
    },
  ],

  wifiName: [
    {
      required: true,
      message: "请填写 wifi 名称",
      trigger: "blur",
    },
  ],
  wifiPassword: [
    {
      required: true,
      message: "请填写 wifi 密码",
      trigger: "blur",
    },
  ],
  wifiEncrypt: [
    {
      required: true,
      message: "请选择 wifi 加密方式",
      trigger: "change",
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
