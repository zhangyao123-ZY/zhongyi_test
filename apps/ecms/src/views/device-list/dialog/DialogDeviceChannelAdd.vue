<!--
 * 设备通道添加-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogDeviceChannelAdd.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="设备添加通道"
    width="680"
    append-to-body
    @close="handleCloseEventFn"
  >
    <div>
      <el-scrollbar max-height="400px">
        <el-form
          ref="ruleFormRef"
          size="large"
          :model="formData"
          label-width="100px"
          class="w-full"
        >
          <el-row v-for="(domain, index) in formData.domains" :key="domain.key">
            <el-col :span="11">
              <el-form-item
                label="通道名称"
                :rules="formDataRules.channelName"
                :prop="'domains.' + index + '.channelName'"
              >
                <el-input
                  v-model.trim="domain.channelName"
                  placeholder="请填写通道名称"
                  maxlength="40"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="通道 mac"
                :rules="formDataRules.channelMac"
                :prop="'domains.' + index + '.channelMac'"
              >
                <el-input
                  v-model.trim="domain.channelMac"
                  placeholder="请填写通道 mac"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div class="flex justify-center h-10 items-center">
                <i-ep-delete-filled
                  v-if="index > 0"
                  class="text-black hover:text-primary cursor-pointer"
                  @click="eventDeleteFormFn(domain)"
                />
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>

      <div class="flex w-full justify-center items-center space-x-2">
        <i-ep-circle-plus
          title="添加"
          class="w-8 h-8 text-black hover:text-primary cursor-pointer"
          @click="eventAddFormFn"
        />
        <span class="text-black/40 text-sm"
          >创建通道 {{ formData.domains.length }} 个</span
        >
      </div>
    </div>

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
import { DeviceChannelInfo } from "videiot-server/src/types";

const customProps = defineProps<{
  // 设备Id(设备 Sn)
  deviceId?: string;
}>();
const customEmits = defineEmits<{
  // 更新通知
  (e: "update-notification", addChannelList: DeviceChannelInfo[]): void;
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
  domains: [
    {
      key: Date.now(),
      channelName: "",
      channelMac: "",
    },
  ],
});

// 表单校验
const formDataRules = {
  channelName: [
    {
      required: true,
      message: "请填写通道名称",
      trigger: "blur",
    },
  ],
  channelMac: [
    {
      required: true,
      message: "请填写通道 mac",
      trigger: "blur",
    },
  ],
};

// 是否禁用添加表单
const isFormAddDisabled = computed(() => {
  return formData.domains.length >= 10;
});
// 添加新的表单子项
const eventAddFormFn = () => {
  if (isFormAddDisabled.value) {
    return ElMessage.error("每次最多添加10个通道");
  }
  formData.domains.push({
    key: Date.now(),
    channelName: "",
    channelMac: "",
  });
};
// 删除表单子项
const eventDeleteFormFn = (keyInfo: any) => {
  const index = formData.domains.indexOf(keyInfo);
  if (index !== -1) {
    formData.domains.splice(index, 1);
  }
};

/**
 * 添加 NVR 设备通道-提交
 */
const eventSubmitFn = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { resultCode, resultMsg, data } =
        await VideIotServer.getInstance().createDeviceChannel({
          deviceSn: customProps.deviceId!,
          channels: formData.domains.map((item) => {
            return {
              channelName: item.channelName,
              mac: item.channelMac,
            };
          }),
        });
      const oRecordStatus = resultCode === "0";
      if (oRecordStatus) {
        const oM: DeviceChannelInfo[] = (data.channelList || []).map((item) => {
          return {
            channelSn: item.channelSn,
            channelName: item.channelName,
            onlineStatus: 0,
          };
        });
        customEmits("update-notification", oM);
        handleCloseEventFn();
      } else {
        // 关闭相关提示
        ElMessage.closeAll();
      }
      useResultAlertBox({
        title: "设备添加通道",
        resultType: oRecordStatus ? "basic-success" : "basic-error",
        auxiliaryText: oRecordStatus
          ? "添加通道成功"
          : resultMsg || "添加通道失败",
      });
    }
  });
};
</script>
