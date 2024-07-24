<!--
 * 设备列表
 * @author: web_develop
 * @since: 2024-07-15
 * index.vue
-->
<template>
  <div class="w-full h-full p-5 flex flex-col">
    <BreadcrumbLayout
      :breadcrumb-list="DeviceBreadcrumbOptions"
      class="shrink-0"
    />
    <TablePaginationLayout
      :is-loading="isTableLoading"
      :pagination-num="pageIndex"
      :pagination-total="pageTotal"
      class="flex-1 overflow-hidden"
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
          <el-table-column prop="deviceSn" label="设备 SN" min-width="120px">
          </el-table-column>
          <!-- <el-table-column prop="date" label="设备 MAC" min-width="100px">
          </el-table-column> -->
          <el-table-column
            label="设备名称"
            min-width="120px"
            :show-overflow-tooltip="false"
          >
            <template #default="{ row }">
              <div class="w-full flex items-center space-x-4 select-none">
                <div class="flex-1 overflow-hidden">
                  <TextExceedTooltip :content="row.deviceName" />
                </div>

                <el-button
                  type="primary"
                  link
                  class="shrink-0 font-normal"
                  @click="deviceNameDialogOpenFn(row)"
                >
                  修改
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="date" label="设备状态" min-width="80px">
            <template #default="{ row }">
              <template
                v-for="onlineStatusItem in DeviceOnlineStatusOptions"
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

          <el-table-column prop="date" label="接入协议" min-width="120px">
            <template #default="{ row }">
              <template
                v-for="protocolItem in DeviceProtocolOptions"
                :key="protocolItem.value"
              >
                <span v-if="protocolItem.value === row.protocol">
                  {{ protocolItem.name }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="设备类型" min-width="140px">
            <template #default="{ row }">
              <template
                v-for="typeItem in DeviceTypeOptions"
                :key="typeItem.value"
              >
                <div
                  v-if="typeItem.value === row.deviceType"
                  class="w-full flex items-center space-x-4 justify-between"
                >
                  <span>{{ typeItem.name }}</span>
                  <el-button
                    type="primary"
                    link
                    @click="nvrDeviceChannelListDialogOpenFn(row)"
                  >
                    通道信息
                  </el-button>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            min-width="240px"
            label="操作"
            :show-overflow-tooltip="false"
          >
            <template #default="{ row }">
              <div>
                <el-button
                  v-if="row.deviceType !== DeviceTypeEnum.NVR"
                  type="primary"
                  link
                  @click="livePlaybackDialogOpenFn"
                  >直播回放</el-button
                >
                <el-button
                  type="danger"
                  link
                  @click="deviceDeleteDialogOpenFn(row)"
                  >设备删除</el-button
                >
                <el-button
                  type="primary"
                  link
                  @click="deviceDetailDialogOpenFn(row)"
                  >设备详情</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template #header>
        <div class="w-full flex justify-between items-center">
          <div class="flex flex-wrap space-x-4">
            <el-input
              v-model.trim="filterDeviceSn"
              placeholder="请输入设备 SN"
              class="w-48"
              size="large"
            />
            <!-- <el-input
              v-model.trim="filterDeviceMac"
              placeholder="请输入设备 MAC"
              class="w-48"
              size="large"
            />
            <el-input
              v-model.trim="filterDeviceName"
              placeholder="请输入设备名称"
              class="w-48"
              size="large"
            /> -->
            <el-button
              type="primary"
              size="large"
              @click="eventSearchFilterDeviceListFn('search')"
              >查询</el-button
            >
            <el-button
              size="large"
              @click="eventSearchFilterDeviceListFn('reset')"
              >重置</el-button
            >
          </div>
          <!-- 添加设备 -->
          <div>
            <el-button
              type="primary"
              size="large"
              @click="deviceAddDialogOpenFn"
              >新增设备</el-button
            >
          </div>
        </div>
      </template>
    </TablePaginationLayout>
  </div>

  <!-- 设备名称编辑-弹窗 -->
  <DialogDeviceNameEditComponent
    v-if="deviceNameDialogVisible"
    v-model:dialog-visible="deviceNameDialogVisible"
    :edit-device-name="editDeviceName"
    :auxiliary-confog="editDeviceNameOptions"
    @update-notification="eventGetDeviceListFn"
  />

  <!-- 设备删除-弹窗 -->
  <DialogDeviceRemoveComponent
    v-if="deviceDeleteDialogVisible"
    v-model:dialog-visible="deviceDeleteDialogVisible"
    :device-id="deleteDeviceOptions.deviceSn"
    :device-protocol="deleteDeviceOptions.protocol"
    :device-type="deleteDeviceOptions.deviceType"
    :device-channel-list="deleteDeviceOptions.channelList"
    @update-notification="eventGetDeviceListFn"
  />

  <!-- 添加设备-弹窗 -->
  <DialogDeviceAddComponent
    v-if="deviceAddDialogVisible"
    v-model:dialog-visible="deviceAddDialogVisible"
    @update-notification="eventSearchFilterDeviceListFn('reset')"
  />

  <!-- 设备通道信息-弹窗 -->
  <DialogDeviceChannelListComponent
    v-if="nvrDeviceChannelListDialogVisible"
    :device-id="nvrDeviceChannelListDialogOptions.deviceSn"
    :device-type="nvrDeviceChannelListDialogOptions.deviceType"
    :channel-list="nvrDeviceChannelListDialogOptions.channelList"
    v-model:dialog-visible="nvrDeviceChannelListDialogVisible"
    @update-notification="eventGetDeviceListFn"
  />

  <!-- 设备详情-弹窗 -->
  <DialogDeviceDetailsComponent
    v-if="deviceDetailDialogVisible"
    :device-id="deviceDetailDialogOptions.deviceSn"
    v-model:dialog-visible="deviceDetailDialogVisible"
  />

  <!-- 直播回放 -->
  <DialogLiveReviewComponent
    v-if="livePlaybackDialogVisible"
    v-model:dialog-visible="livePlaybackDialogVisible"
  />
</template>
<script lang="ts" setup>
import BreadcrumbLayout from "@/components/layout/BreadcrumbLayout.vue";
import TablePaginationLayout from "@/components/layout/TablePaginationLayout.vue";
import TextExceedTooltip from "@/components/ui/TextExceedTooltip.vue";
import DialogDeviceNameEditComponent from "./dialog/DialogDeviceNameEdit.vue";
import DialogDeviceRemoveComponent from "./dialog/DialogDeviceRemove.vue";
import DialogDeviceChannelListComponent from "./dialog/DialogDeviceChannelList.vue";
import DialogDeviceDetailsComponent from "./dialog/DialogDeviceDetails.vue";
import DialogLiveReviewComponent from "./dialog/DialogLiveReview.vue";
import DialogDeviceAddComponent from "./dialog/DialogDeviceAdd.vue";

import { usePagination } from "@/hooks/usePagination";

import {
  DeviceBreadcrumbOptions,
  DeviceProtocolOptions,
  DeviceTypeOptions,
  DeviceOnlineStatusOptions,
} from "@/hooks/options/device-list";
import { DeviceListItem } from "videiot-server/src/types";
import {
  useDeviceAddDialog,
  useDeviceDeleteDialog,
  useDeviceDetailDialog,
  useDeviceNameEditDialog,
  useLivePlaybackDialog,
  useNvrDeviceChannelListDialog,
} from "./dialog/useDialog";

import VideIotServer from "videiot-server";
import { DeviceTypeEnum } from "@/types/device";
import { ElMessage } from "element-plus";

/**
 * 设备列表-表格数据
 */

const isTableLoading = ref(false);
const tableDataOptions = ref<DeviceListItem[]>([]);

// 设备 SN 过滤
const filterDeviceSn = ref("");
// // 设备 MAC 过滤
// const filterDeviceMac = ref("");
// // 设备名称过滤
// const filterDeviceName = ref("");

// 获取设备列表数据
const eventGetDeviceListFn = async () => {
  isTableLoading.value = true;
  const { resultCode, data, total } = await VideIotServer.getInstance()
    .getDeviceList({
      page: pageIndex.value,
      pageSize: pageSize.value,
    })
    .finally(() => {
      isTableLoading.value = false;
    });
  if (resultCode === "0") {
    pageTotal.value = total || 0;
    tableDataOptions.value = data;
  }
};

// 设备列表过滤查询/重置
const eventSearchFilterDeviceListFn = async (type: "search" | "reset") => {
  if (type === "reset") {
    pageIndex.value = 1;
    filterDeviceSn.value = "";
    // filterDeviceMac.value = "";
    // filterDeviceName.value = "";
    eventGetDeviceListFn();
    return;
  }

  if (type === "search") {
    // 查询指定设备 Sn
    if (!filterDeviceSn.value) return ElMessage.warning("请输入设备 SN");
    isTableLoading.value = true;
    const { resultCode, data: deviceInfo } = await VideIotServer.getInstance()
      .getDeviceInfo(filterDeviceSn.value)
      .finally(() => {
        isTableLoading.value = false;
      });
    if (resultCode === "0") {
      deviceInfo.protocol = Number(deviceInfo.protocol);
      tableDataOptions.value = [deviceInfo];
    }
  }
};

// 设备列表分页
const { pageIndex, pageSize, pageTotal, handlePageChangeEventFn } =
  usePagination({
    changeEventFn: eventGetDeviceListFn,
  });

/**
 * 设备名称修改-弹窗
 */
const {
  isDialogVisible: deviceNameDialogVisible,
  dialogEditName: editDeviceName,
  dialogOptions: editDeviceNameOptions,
  eventOpenDialogFn: deviceNameDialogOpenFn,
} = useDeviceNameEditDialog();

/**
 * 设备删除-弹窗
 */
const {
  isDialogVisible: deviceDeleteDialogVisible,
  dialogOptions: deleteDeviceOptions,
  eventOpenDialogFn: deviceDeleteDialogOpenFn,
} = useDeviceDeleteDialog();

/**
 * 设备添加-弹窗
 */
const {
  isDialogVisible: deviceAddDialogVisible,
  eventOpenDialogFn: deviceAddDialogOpenFn,
} = useDeviceAddDialog();

/**
 * 设备详情-弹窗
 */
const {
  isDialogVisible: deviceDetailDialogVisible,
  dialogOptions: deviceDetailDialogOptions,
  eventOpenDialogFn: deviceDetailDialogOpenFn,
} = useDeviceDetailDialog();

/**
 * NVR 设备通道列表-弹窗
 */
const {
  isDialogVisible: nvrDeviceChannelListDialogVisible,
  dialogOptions: nvrDeviceChannelListDialogOptions,
  eventOpenDialogFn: nvrDeviceChannelListDialogOpenFn,
} = useNvrDeviceChannelListDialog();

/**
 * 直播回放-弹窗
 */
const {
  isDialogVisible: livePlaybackDialogVisible,
  eventOpenDialogFn: livePlaybackDialogOpenFn,
} = useLivePlaybackDialog();
</script>
