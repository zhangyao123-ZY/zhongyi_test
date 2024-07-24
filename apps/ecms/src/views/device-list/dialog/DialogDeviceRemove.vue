<!--
 * 设备删除-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogDeviceRemove.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="设备删除"
    width="480"
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
      <el-form-item label="删除类型" prop="deleteType">
        <SelectLayout
          v-model="formData.deleteType"
          :select-option="deviceDeleteTypeOptionsComputed"
        />
      </el-form-item>
      <!-- 删除通道时显示 -->
      <template v-if="formData.deleteType === 2">
        <!-- 国标设备 -->
        <el-form-item
          v-if="
            customProps.deviceProtocol === DeviceProtocolSubTypeEnum.gb28181
          "
          label="通道编码"
          prop="channelSn"
        >
          <!-- <el-input
            v-model.trim="formData.channelSn"
            placeholder="请输入通道编码"
          /> -->

          <SelectLayout
            v-model="formData.channelSn"
            placeholder="请输入通道编码"
            filterable
            allow-create
            :select-option="deviceChannelSnOptions"
          />
        </el-form-item>
        <!-- 大华私有设备/多目摄像机 的通道时必传 -->
        <el-form-item
          v-if="customProps.deviceProtocol === DeviceProtocolSubTypeEnum.dahua"
          label="通道 ID"
          prop="channelId"
        >
          <el-input
            v-model.number="formData.channelId"
            placeholder="请输入通道 ID"
          />
        </el-form-item>
      </template>
      <el-form-item label="是否强制删除">
        <SelectLayout
          v-model="formData.forceDelete"
          :select-option="DeviceDeleteForceOptions"
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
import SelectLayout from "@/components/layout/SelectLayout.vue";
import { useResultAlertBox } from "@/components/ui/result/useResult";
import {
  DeviceDeleteForceOptions,
  DeviceDeleteTypeOptions,
} from "@/hooks/options/device-list";
import { DeviceProtocolSubTypeEnum, DeviceTypeEnum } from "@/types/device";
import { ElLoading, ElMessage, FormInstance } from "element-plus";
import VideIotServer from "videiot-server";
import { DeviceChannelInfo } from "videiot-server/src/types";

const customProps = defineProps<{
  // 设备Id(设备 Sn)
  deviceId?: string;
  // 设备协议
  deviceProtocol?: DeviceProtocolSubTypeEnum;
  // 设备类型(国标协议时生效)
  deviceType?: DeviceTypeEnum;
  // 设备通道信息列表
  deviceChannelList?: DeviceChannelInfo[];
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

// 删除类型数据
const deviceDeleteTypeOptionsComputed = computed(() => {
  // 协议为国标时，并切为 IPC
  if (
    customProps.deviceProtocol === DeviceProtocolSubTypeEnum.gb28181 &&
    customProps.deviceType === DeviceTypeEnum.IPC
  ) {
    return [DeviceDeleteTypeOptions[0]];
  }
  return DeviceDeleteTypeOptions;
});
// 删除通道时，可选择的通道编码
const deviceChannelSnOptions = computed(() => {
  // 国标协议且为 NVR
  if (
    customProps.deviceProtocol === DeviceProtocolSubTypeEnum.gb28181 &&
    customProps.deviceType === DeviceTypeEnum.NVR &&
    customProps.deviceChannelList
  ) {
    return customProps.deviceChannelList.map((item) => {
      return {
        label: item.channelName + "(" + item.channelSn + ")",
        value: item.channelSn,
      };
    });
  }

  return [];
});
/**
 * 表单
 */
const ruleFormRef = ref<FormInstance>();
const formData = reactive({
  // 删除类型(默认删除设备)
  deleteType: 1,
  // 是否强制删除(默认不强制)
  forceDelete: 0,
  // 通道编码
  channelSn: "",
  // 通道 ID
  channelId: null as number | null,
});
const formDataRules = {
  deleteType: [
    {
      required: true,
      message: "请选择删除类型",
      trigger: "change",
    },
  ],
  channelSn: [
    {
      required: true,
      message: "请输入通道编码",
      trigger: "blur",
    },
  ],
  channelId: [
    {
      required: true,
      message: "请输入通道 ID",
      trigger: "blur",
    },
    {
      type: "number",
      message: "请输入正确的通道 ID",
    },
  ],
};

/**
 * 删除指定设备
 */
const eventSubmitFn = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { deleteType, channelSn, channelId, forceDelete } = formData;
      const oPortParam = {
        deleteType,
        deviceSn: customProps.deviceId || "",
        force: forceDelete,
      };
      // 删除通道时
      if (deleteType === 2) {
        Object.assign(oPortParam, {
          channelSn,
          channelId,
        });
      }
      const oEloading = ElLoading.service({
        text: "正在删除设备，请稍后...",
      });
      const { resultCode, resultMsg } = await VideIotServer.getInstance()
        .deleteDevice(oPortParam)
        .finally(() => {
          oEloading.close();
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
        title: "设备删除",
        resultType: oRecordStatus ? "basic-success" : "basic-error",
        auxiliaryText: oRecordStatus ? "删除成功" : resultMsg || "删除失败",
      });
    }
  });
};
</script>
