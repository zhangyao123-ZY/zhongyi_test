<!--
 * 设备详情-弹窗
 * @author: web_develop
 * @since: 2024-07-16
 * DialogDeviceDetails.vue
-->
<template>
  <el-dialog
    :model-value="true"
    title="设备详情"
    width="80%"
    @close="handleCloseEventFn"
  >
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-change="handleTabChangeEventFn"
    >
      <el-tab-pane name="first" label="基础信息" lazy>
        <el-descriptions :column="2" border>
          <el-descriptions-item
            v-for="basicItem in deviceBasicInfoContent"
            :key="basicItem.label"
            label-align="right"
            :label="basicItem.label"
          >
            <!-- 特殊处理 -->
            <template v-if="basicItem.special" #default>
              <!-- 接入协议 protocol -->
              <div v-if="basicItem.special === 'protocol'">
                <template
                  v-for="protocolItem in DeviceProtocolOptions"
                  :key="protocolItem.name"
                >
                  <span v-if="protocolItem.value === basicItem.value">
                    {{ protocolItem.name }}
                  </span>
                </template>
              </div>

              <!-- 在线状态 onlineStatus -->
              <div v-else-if="basicItem.special === 'onlineStatus'">
                <template
                  v-for="onlineStatusItem in DeviceOnlineStatusOptions"
                  :key="onlineStatusItem.name"
                >
                  <el-text
                    v-if="onlineStatusItem.value === basicItem.value"
                    :type="onlineStatusItem.textType"
                  >
                    {{ onlineStatusItem.name }}
                  </el-text>
                </template>
              </div>
              <!-- 设备类型 deviceType -->
              <div v-else-if="basicItem.special === 'deviceType'">
                <template
                  v-for="typeItem in DeviceTypeOptions"
                  :key="typeItem.name"
                >
                  <span v-if="typeItem.value === basicItem.value">
                    {{ typeItem.name }}
                  </span>
                </template>
              </div>
              <!-- 拉流协议 pullProtocol -->
              <div v-else-if="basicItem.special === 'pullProtocol'">
                <template
                  v-for="pullProtocolItem in DevicePullStreamProtocolOptions"
                  :key="pullProtocolItem.name"
                >
                  <span v-if="pullProtocolItem.value === basicItem.value">
                    {{ pullProtocolItem.name }}
                  </span>
                </template>
              </div>
            </template>
            <template v-else #default>
              {{ basicItem.value || "" }}
            </template>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane
        v-if="isCanQueryNodeInfo"
        name="second"
        label="节点信息"
        lazy
      >
        <el-descriptions :column="2" border>
          <el-descriptions-item
            v-for="nodeItem in deviceBasicNodeInfoContent"
            :key="nodeItem.label"
            label-align="right"
            :label="nodeItem.label"
          >
            <!-- 特殊处理 -->
            <template v-if="nodeItem.special" #default>
              <!-- 节点状态 status -->
              <div v-if="nodeItem.special === 'status'">
                <template
                  v-for="nodeStatusItem in DeviceNodeStatusOptions"
                  :key="nodeStatusItem.name"
                >
                  <el-text
                    v-if="nodeStatusItem.value === nodeItem.value"
                    :type="nodeStatusItem.textType"
                  >
                    {{ nodeStatusItem.name }}
                  </el-text>
                </template>
              </div>
            </template>
            <template v-else #default>
              {{ nodeItem.value || "" }}
            </template>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  DeviceProtocolOptions,
  DeviceTypeOptions,
  DeviceNodeStatusOptions,
  DeviceOnlineStatusOptions,
  DevicePullStreamProtocolOptions,
} from "@/hooks/options/device-list";
import {
  DeviceOnlineStatusEnum,
  DeviceProtocolSubTypeEnum,
  DeviceTypeEnum,
} from "@/types/device";
import VideIotServer from "videiot-server";
import { DeviceInfo, DeviceNodeInfo } from "videiot-server/src/types";

const customProps = defineProps<{
  // 设备Id(设备 Sn)
  deviceId?: string;
}>();
// 弹窗是否可见
const dialogVisible = defineModel<boolean>("dialogVisible");
// 关闭弹窗
const handleCloseEventFn = () => {
  dialogVisible.value = false;
};

/**
 * 设备的相关信息
 */

interface DeviceInfoContentItenInterface {
  label: string;
  value: string | number | undefined;
  special?: string;
}
const isLoadding = ref<boolean>(false);
const activeName = ref<string>("first");
const handleTabChangeEventFn = (tabName: string) => {
  isLoadding.value = true;
  if (tabName === "first") {
    Promise.allSettled([
      eventGetDeviceDetailsFn(),
      eventGetDeviceIpFn(),
    ]).finally(() => {
      isLoadding.value = false;
    });
  } else {
    eventGetDeviceNodeDetailsFn().finally(() => {
      isLoadding.value = false;
    });
  }
};

/**
 * 设备基本信息
 */
const deviceBasicInfo = shallowRef<DeviceInfo | undefined>(undefined);
const deviceBasicInfoContent = computed(() => {
  const {
    deviceSn,
    deviceName,
    protocol,
    onlineStatus,
    isIntranet,
    isSubDomain,
    /** 国标28181协议(protocol === 1) */
    deviceType,
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
    pullProtocol,
    /** 千里眼 */
    firmwareVersion,
    cameraAppVersion,
    imei,
    moduleId,
  } = deviceBasicInfo.value || {};

  const oBasicInfo: DeviceInfoContentItenInterface[] = [
    {
      label: "设备 id",
      value: deviceSn,
    },
    {
      label: "设备名称",
      value: deviceName,
    },
    {
      label: "设备接入协议",
      special: "protocol",
      value: protocol,
    },
  ];
  // 国标且nvr设备无在线状态
  if (deviceType !== DeviceTypeEnum.NVR) {
    oBasicInfo.push({
      label: "在线状态",
      special: "onlineStatus",
      value: onlineStatus || DeviceOnlineStatusEnum.offline,
    });
  }
  oBasicInfo.push({
    label: "是否内网",
    value: isIntranet === 1 ? "是" : "否",
  });
  oBasicInfo.push({
    label: "是否绑定下级域",
    value: isSubDomain === 1 ? "是" : "否",
  });

  // 设备 IP 信息
  if (deviceIpInfo.value) {
    const { ip: deviceIp, port: devicePort } = deviceIpInfo.value;

    oBasicInfo.push({
      label: "设备 IP 地址",
      value: deviceIp,
    });
    oBasicInfo.push({
      label: "设备端口",
      value: devicePort,
    });
  }
  // 国标28181协议
  if (protocol === DeviceProtocolSubTypeEnum.gb28181) {
    // 登录密码解码
    const decryptRSALoginPwd =
      VideIotServer.getInstance().decryptRSAprivatekey(loginPwd || "") || "";

    const oGb: DeviceInfoContentItenInterface[] = [
      {
        label: "设备类型",
        special: "deviceType",
        value: deviceType,
      },
      {
        label: "登录用户名",
        value: loginName,
      },

      {
        label: "登录密码",
        value: decryptRSALoginPwd,
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
        label: "SIP 服务器端口",
        value: sipserverPort || SIPServerPort,
      },

      {
        label: "SIP 服务器 IP",
        value: sipserverIP || SIPServerIP,
      },
      {
        label: "拉流协议",
        special: "pullProtocol",
        value: pullProtocol,
      },
    ];
    return oBasicInfo.concat(oGb);
  }

  // 千里眼协议
  if (protocol === DeviceProtocolSubTypeEnum.senrigan) {
    const oSenrigan: DeviceInfoContentItenInterface[] = [
      {
        label: "固件版本",
        value: firmwareVersion,
      },

      {
        label: "应用程序版本",
        value: cameraAppVersion,
      },

      {
        label: "设备 imei",
        value: imei,
      },

      {
        label: "设备 moduleId",
        value: moduleId,
      },
    ];

    return oBasicInfo.concat(oSenrigan);
  }
  return oBasicInfo;
});

// 获取设备详情
const eventGetDeviceDetailsFn = async () => {
  const { resultCode, data: deviceInfo } =
    await VideIotServer.getInstance().getDeviceInfo(customProps.deviceId!);
  if (resultCode === "0") {
    deviceInfo.protocol = Number(deviceInfo.protocol);
    deviceBasicInfo.value = deviceInfo;
    return deviceInfo;
  }
};

const deviceIpInfo = shallowRef<
  | {
      ip: string;
      port: string;
    }
  | undefined
>(undefined);
// 获取设备IP
const eventGetDeviceIpFn = async () => {
  const { resultCode, data } = await VideIotServer.getInstance().getDeviceIP(
    customProps.deviceId!
  );
  if (resultCode === "0") {
    deviceIpInfo.value = data;
  } else {
    deviceIpInfo.value = undefined;
  }
  return data;
};

/**
 * 设备节点相关
 */
// 判断是否可查询节点信息
const isCanQueryNodeInfo = computed(() => {
  return deviceBasicInfo.value?.protocol !== DeviceProtocolSubTypeEnum.gb28181;
});

const deviceBasicNodeInfo = shallowRef<DeviceNodeInfo | undefined>(undefined);
const deviceBasicNodeInfoContent = computed(() => {
  const {
    platformName,
    status,
    /** gb28181 */
    sipSerIpIntranet,
    sipSerPortIntranet,
    sipSerIpv6Intranet,
    sipSerIpv6PortIntranet,
    sipSerHostIntranet,
    sipSerHostPortIntra,
    sipId,
    sipDomain,
    sipHost,
    sipHostPort,
    sipIpv4,
    sipIpv4Port,
    sipIpv6,
    sipIpv6Port,

    /** 私有云 */
    host,
    hostPort,
    /** 千里眼 */
    ipv4,
    ipv4Port,
    ipv6,
    ipv6Port,
    domainIntranet,
    portIntranet,
    ipv4Intranet,
    ipv4PortIntranet,
    Ipv6Intranet,
    Ipv6PortIntranet,
  } = deviceBasicNodeInfo.value || {};
  const oBasicInfo: DeviceInfoContentItenInterface[] = [
    {
      label: "节点名称",
      value: platformName,
    },
    {
      label: "节点状态",
      special: "status",
      value: status,
    },
  ];

  const { protocol } = deviceBasicInfo.value || {};

  if (protocol === DeviceProtocolSubTypeEnum.gb28181) {
    const oGb: DeviceInfoContentItenInterface[] = [
      {
        label: "SIP 服务内网 ipv4",
        value: sipSerIpIntranet,
      },
      {
        label: "SIP 服务内网 ipv4Prot",
        value: sipSerPortIntranet,
      },
      {
        label: "SIP 服务内网 ipv6",
        value: sipSerIpv6Intranet,
      },
      {
        label: "SIP 服务内网 ipv6Prot",
        value: sipSerIpv6PortIntranet,
      },
      {
        label: "SIP 服务内网域名",
        value: sipSerHostIntranet,
      },
      {
        label: "SIP 服务内网域名端口",
        value: sipSerHostPortIntra,
      },
      {
        label: "SIP 服务器 ID",
        value: sipId,
      },
      {
        label: "SIP 服务器域",
        value: sipDomain,
      },
      {
        label: "SIP 服务器域名",
        value: sipHost,
      },
      {
        label: "SIP 服务器域名端口",
        value: sipHostPort,
      },
      {
        label: "SIP 服务器 ipv4",
        value: sipIpv4,
      },
      {
        label: "SIP 服务器 ipv4Prot",
        value: sipIpv4Port,
      },
      {
        label: "SIP 服务器 ipv6",
        value: sipIpv6,
      },
      {
        label: "SIP 服务器 ipv6Prot",
        value: sipIpv6Port,
      },
    ];
    return oBasicInfo.concat(oGb);
  }
  // 非国标协议时，添加 设备网关域名/网关域名端口
  oBasicInfo.concat([
    {
      label: "设备网关域名",
      value: host,
    },
    {
      label: "网关域名端口",
      value: hostPort,
    },
  ]);

  if (protocol === DeviceProtocolSubTypeEnum.senrigan) {
    const oSenrigan: DeviceInfoContentItenInterface[] = [
      {
        label: "ipv4",
        value: ipv4,
      },
      {
        label: "ipv4Prot",
        value: ipv4Port,
      },
      {
        label: "ipv6",
        value: ipv6,
      },
      {
        label: "ipv6Prot",
        value: ipv6Port,
      },
      {
        label: "网关接入域名(内网)",
        value: domainIntranet,
      },
      {
        label: "网关接入端口(内网)",
        value: portIntranet,
      },
      {
        label: "内网 ipv4",
        value: ipv4Intranet,
      },
      {
        label: "内网 ipv4Prot",
        value: ipv4PortIntranet,
      },
      {
        label: "内网 ipv6",
        value: Ipv6Intranet,
      },
      {
        label: "内网 ipv6Prot",
        value: Ipv6PortIntranet,
      },
    ];
    return oBasicInfo.concat(oSenrigan);
  }
  return oBasicInfo;
});
// 获取设备节点详情
const eventGetDeviceNodeDetailsFn = async () => {
  // deviceBasicNodeInfo.value = undefined;
  // console.log('获取设备节点详情', {deviceSn: customProps.deviceId});

  const { resultCode, data } =
    await VideIotServer.getInstance().getDeviceNodeInfo(customProps.deviceId!);
  if (resultCode === "0") {
    deviceBasicNodeInfo.value = data[0];
  }
};

onMounted(() => {
  handleTabChangeEventFn(activeName.value);
});
</script>
