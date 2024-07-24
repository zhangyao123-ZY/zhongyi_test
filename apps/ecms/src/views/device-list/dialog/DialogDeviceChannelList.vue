<!--
 * 设备通道列表(NVR设备通道列表)-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogDeviceChannelList.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="通道列表"
    width="80%"
    @close="handleCloseEventFn"
  >
    <div>
      <div
        v-if="customProps.deviceType === DeviceTypeEnum.NVR"
        class="flex justify-end"
      >
        <el-button type="primary" @click="eventOpenDialogDeviceChannelAddFn"
          >添加通道</el-button
        >
      </div>
      <div class="h-[480px]">
        <TablePaginationLayout
          :pagination-num="pageIndex"
          :pagination-total="pageTotal"
          @pagination-change="handlePageChangeEventFn"
        >
          <template #default>
            <el-table
              :data="tableDataOptions"
              class="h-full"
              cell-class-name="text-black/85 font-normal"
              header-cell-class-name="bg-[#FAFAFA] text-black/85 font-normal"
              show-overflow-tooltip
            >
              <el-table-column
                prop="channelName"
                label="通道名称"
                min-width="140px"
              ></el-table-column>
              <el-table-column
                prop="channelSn"
                label="通道编码"
                min-width="140px"
              ></el-table-column>
              <el-table-column prop="onlineStatus" label="在线状态">
                <template #default="{ row }">
                  <template
                    v-for="onlineStatusItem in DeviceChannelOnlineStatusOptions"
                    :key="onlineStatusItem.value"
                  >
                    <el-text
                      v-if="onlineStatusItem.value === row.onlineStatus"
                      :type="onlineStatusItem.textType"
                    >
                      {{ onlineStatusItem.name }}
                    </el-text>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="date"
                label="1400 通道编码"
                min-width="160px"
                :show-overflow-tooltip="false"
              >
                <template #default="{ row }">
                  <div
                    v-if="row.gaChannelCode"
                    class="flex items-center space-x-4"
                  >
                    <div class="flex-1 overflow-hidden">
                      <TextExceedTooltip :content="row.gaChannelCode" />
                    </div>

                    <el-button
                      type="primary"
                      link
                      class="shrink-0"
                      @click="device1400ListDialogOpenFn(row)"
                      >1400 信息</el-button
                    >
                  </div>
                  <div v-else class="flex items-center justify-between w-full">
                    <span>-</span>
                    <el-button
                      type="primary"
                      link
                      @click="device1400AddDialogOpenFn(row)"
                      >添加 1400 设备</el-button
                    >
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                min-width="120px"
                :show-overflow-tooltip="false"
              >
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    link
                    @click="livePlaybackDialogOpenFn"
                    >直播回放</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </TablePaginationLayout>
      </div>
    </div>

    <!-- 添加通道-弹窗 -->
    <DialogDeviceChannelAddCompoent
      v-if="isDialogDeviceChannelAddVisible"
      :device-id="customProps.deviceId"
      v-model:dialog-visible="isDialogDeviceChannelAddVisible"
      @update-notification="handleUpdateDeviceChannelListFn"
    />
    <!-- 直播回放-弹窗 -->
    <DialogLiveReviewComponent
      v-if="livePlaybackDialogVisible"
      v-model:dialog-visible="livePlaybackDialogVisible"
    />

    <!-- 1400 设备列表-弹窗 -->
    <Dialog1400DeviceListComponent
      v-if="device1400ListDialogVisible"
      v-model:dialog-visible="device1400ListDialogVisible"
      :channel-code="device1400ListOptions.channelCode"
    />
    <!-- 1400 设备添加-弹窗 -->
    <Dialog1400DeviceAddComponent
      v-if="device1400AddDialogVisible"
      :channel-id="device1400AddOptions.channelSn"
      v-model:dialog-visible="device1400AddDialogVisible"
      @update-notification="handleDevice1400AddInfoFn"
    />
  </el-dialog>
</template>
<script lang="ts" setup>
import TablePaginationLayout from "@/components/layout/TablePaginationLayout.vue";
import TextExceedTooltip from "@/components/ui/TextExceedTooltip.vue";
import DialogDeviceChannelAddCompoent from "./DialogDeviceChannelAdd.vue";
import DialogLiveReviewComponent from "./DialogLiveReview.vue";
import Dialog1400DeviceListComponent from "./Dialog1400DeviceList.vue";
import Dialog1400DeviceAddComponent from "./Dialog1400DeviceAdd.vue";

import { DeviceChannelOnlineStatusOptions } from "@/hooks/options/device-list";
import { usePagination } from "@/hooks/usePagination";
import { DeviceChannelInfo } from "videiot-server/src/types";
import {
  useDevice1400AddDialog,
  useDevice1400ListDialog,
  useLivePlaybackDialog,
  useNvrDeviceChannelAddDialog,
} from "./useDialog";
import { DeviceTypeEnum } from "@/types/device";

const customProps = withDefaults(
  defineProps<{
    // 设备Id
    deviceId?: string;
    // 设备类型
    deviceType?: DeviceTypeEnum;
    // 通道列表
    channelList?: DeviceChannelInfo[];
  }>(),
  {
    channelList: () => [],
  }
);

const customEmits = defineEmits<{
  // 通知更新
  (e: "update-notification"): void;
}>();

// 弹窗是否可见
const dialogVisible = defineModel<boolean>("dialogVisible");

// 关闭弹窗
const handleCloseEventFn = () => {
  dialogVisible.value = false;
};

/**
 * 表格数据相关
 */
// const isTableLoading = ref(false);
// 记录新增的设备通道信息
const recordAddDeviceChannelList = shallowRef<DeviceChannelInfo[]>([]);

const tableDataOptionsAll = computed(() => {
  return [...recordAddDeviceChannelList.value, ...customProps.channelList];
});

const tableDataOptions = computed(() => {
  if (tableDataOptionsAll.value.length === 0) {
    return [];
  }
  // 分页截取
  const oIndex = (pageIndex.value - 1) * pageSize.value;
  return tableDataOptionsAll.value.slice(oIndex, oIndex + pageSize.value);
});

// 获取 NVR 设备通道列表
// const eventGetDeviceChannelListFn = async () => {
//   console.log("获取 NVR 设备通道列表", pageSize.value, pageIndex.value);
// };

// 设备列表分页
const { pageIndex, pageSize, pageTotal, handlePageChangeEventFn } =
  usePagination({});
watch(
  tableDataOptionsAll,
  (newLength) => {
    pageTotal.value = newLength.length || 0;
  },
  {
    immediate: true,
  }
);

/**
 * 通道添加-弹窗
 */
const {
  isDialogVisible: isDialogDeviceChannelAddVisible,
  // dialogOptions: dialogDeviceChannelAddOptions,
  eventOpenDialogFn: eventOpenDialogDeviceChannelAddFn,
} = useNvrDeviceChannelAddDialog();

// 更新 NVR 设备列表
const handleUpdateDeviceChannelListFn = (channelList: DeviceChannelInfo[]) => {
  recordAddDeviceChannelList.value = [
    ...channelList,
    ...recordAddDeviceChannelList.value,
  ];
  pageIndex.value = 1;
  // 通知更新
  customEmits("update-notification");
};

/**
 * 直播回放-弹窗
 */
const {
  isDialogVisible: livePlaybackDialogVisible,
  eventOpenDialogFn: livePlaybackDialogOpenFn,
} = useLivePlaybackDialog();

/**
 * 1400 设备列表-弹窗
 */
const {
  isDialogVisible: device1400ListDialogVisible,
  dialogOptions: device1400ListOptions,
  eventOpenDialogFn: device1400ListDialogOpenFn,
} = useDevice1400ListDialog();

/**
 * 1400 设备添加-弹窗
 */
const {
  isDialogVisible: device1400AddDialogVisible,
  dialogOptions: device1400AddOptions,
  eventOpenDialogFn: device1400AddDialogOpenFn,
} = useDevice1400AddDialog();
const handleDevice1400AddInfoFn = (options: {
  channelId: string;
  channelCode: string;
}) => {
  const { channelId, channelCode } = options;
  for (let index = 0; index < tableDataOptionsAll.value.length; index++) {
    const element = tableDataOptionsAll.value[index];
    if (element.channelSn === channelId) {
      element.gaChannelCode = channelCode;
      // 通知更新
      customEmits("update-notification");
      return;
    }
  }
};
</script>
