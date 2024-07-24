<!--
 * 结果提示
 * @author: web_develop
 * @since: 2024-07-16
 * ResultPrompt.vue
-->
<template>
  <!-- 成功 -->
  <div
    v-if="customProps.resultType === 'basic-success'"
    class="flex h-full w-full flex-col items-center justify-center space-y-4"
  >
    <i-custom-succeed class="w-28 h-28 text-success" />
    <p class="text-basic-text text-xl">{{ customProps.auxiliaryText }}</p>
  </div>
  <!-- 失败 -->
  <div
    v-else-if="customProps.resultType === 'basic-error'"
    class="flex h-full w-full flex-col items-center justify-center space-y-4"
  >
    <i-custom-fail class="w-28 h-28 text-danger" />
    <p class="text-basic-text text-xl">{{ customProps.auxiliaryText }}</p>
  </div>
  <!-- 国标信息展示 -->
  <el-scrollbar
    v-else-if="customProps.resultType === 'device-info-gb' || customProps.resultType === 'device-info-senrigan' "
    max-height="380px"
  >
    <el-descriptions :column="1" border size="large" class="pt-4 px-4">
      <el-descriptions-item
        v-for="info in pageInfoContent"
        :key="info.label"
        :label="info.label"
        label-align="right"
      >
        <div v-if="info.special">
          <!-- 通道编码 -->
          <ul v-if="info.special === 'channelList'">
            <li v-for="channelItem in info.channelList">
              <span>{{ channelItem }}</span>
            </li>
          </ul>
        </div>
        <span v-else> {{ info.value }}</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { AddDeviceResponse } from "videiot-server/src/types";
import VideIotServer from "videiot-server";

const customProps = defineProps<{
  /**
   * 结果类型
   * * basic-success 成功
   * * basic-error 失败
   * * device-info-gb 国标设备信息
   * * device-info-senrigan 千里眼设备信息
   */
  resultType:
    | "basic-success"
    | "basic-error"
    | "device-info-gb"
    | "device-info-senrigan";

  /**
   * 提示内容设置
   * 成功/失败 内容
   */
  auxiliaryText?: string;
  /**
   * 信息内容配置
   * 国标设备信息/千里眼设备信息时可传递
   */
  auxiliaryConfog?: any;
}>();

/**
 *信息内容配置划分
 */
interface IBasicInfoInterface {
  label: string;
  value?: string;
  special?: string;
  channelList?: any[];
}

const pageInfoContent = computed(() => {
  if (customProps.resultType === "device-info-gb") {
    const {
      deviceSn,
      sipserverID,
      sipserverDomain,
      sipserverIP,
      sipserverPort,
      SIPServerID,
      SIPServerDomain,
      SIPServerIP,
      SIPServerPort,
      loginName,
      loginPwd,
      channelList,
    } = (customProps.auxiliaryConfog || {}) as AddDeviceResponse;
    // 登录密码解密
    const oLoginPwd =
      VideIotServer.getInstance().decryptRSAprivatekey(loginPwd!) || "";

    const oBasicInfo: IBasicInfoInterface[] = [
      {
        label: "设备编码",
        value: deviceSn,
      },
      {
        label: "SIP 服务器 ID",
        value: sipserverID || SIPServerID,
      },
      {
        label: "SIP 服务器域",
        value: sipserverDomain || SIPServerDomain,
      },
      {
        label: "SIP 服务器 IP",
        value: sipserverIP || SIPServerIP,
      },
      {
        label: "SIP 服务器端口",
        value: sipserverPort || SIPServerPort,
      },
      {
        label: "登录用户名",
        value: loginName,
      },
      {
        label: "登录密码",
        value: oLoginPwd,
      },
    ];
    // NVR 通道编码
    if (channelList && channelList.length > 0) {
      oBasicInfo.push({
        label: "设备通道编码",
        special: "channelList",
        channelList,
      });
    }

    return oBasicInfo;
  }
  if (customProps.resultType === "device-info-senrigan") {
    const { deviceCode } = customProps.auxiliaryConfog || {};
    const oBasicInfo: IBasicInfoInterface[] = [
      {
        label: "设备编码",
        value: deviceCode,
      },
      // {
      //   label: "设备 mac",
      //   value: deviceMac,
      // },
    ];
    return oBasicInfo;
  }
  return null;
});
</script>
