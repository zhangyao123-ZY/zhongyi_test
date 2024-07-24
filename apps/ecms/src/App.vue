<template>
  <el-container class="h-screen">
    <el-header
      v-if="isShowRouterView.isShowHeader"
      class="border-b border-b-black/15"
    >
      <router-view name="header"></router-view>
    </el-header>

    <el-container class="overflow-hidden">
      <el-aside v-if="isShowRouterView.isShowSidebar" width="240px">
        <router-view name="sidebar"></router-view
      ></el-aside>
      <el-main class="p-0 bg-[#F5F5F5]">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import VideIotServer from "videiot-server";
import { piniaUserRecord } from "./store/modules/user";
import { ElMessage } from "element-plus";
import { APIResponse } from "videiot-server/src/core/types";

const route = useRoute();

const isShowRouterView = computed(() => {
  const oMatched = route.matched[0];
  const oComponents = oMatched ? oMatched.components : null;
  if (oComponents) {
    return {
      isShowHeader: oComponents.hasOwnProperty("header"),
      isShowSidebar: oComponents.hasOwnProperty("sidebar"),
    };
  } else {
    return {
      isShowHeader: false,
      isShowSidebar: false,
    };
  }
});

/**
 * 服务设置
 */
const videiotApi = VideIotServer.getInstance();
// "http://192.168.199.220:5173/api"
// const baseUrl: string = `${location.protocol}//${location.host}/api`;
const baseUrl: string = `https://pro-api.anytalk.agrtc.cn/api`;
videiotApi.init(baseUrl, {
  RSApriKey: 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMvNqw+s52/LwqJXRbnOBw0PAhUTQdLGBEz4UniaqBoCsHiJU2WRRYc9kE4q/RTk43kryzZVRN/SFCkVz8mLW4MlC5eWGxDGxepNHvEeFEZI8HDzkM1ClpmEN7RBFXk1zvzFAOGZvAgZgP5U6g4U0n+k5mM5TqDLjdNhHvrvqHOlAgMBAAECgYEAypcw840iJvy7BtuQQUpvseh4XnDdHuOehNDYUnESp4CC4d9I2o8VOYHWQA31tF5vTRVelS0gIQnY5pp7ClMQbD/5ZldJM5tHctlYfVKxBvbiHpumNZjcwfEmWOh3/vG7gQmvvuzYc8pWygPdHms304zvAyjvUc974jjUBIR6NYECQQDsH/YPDEvWo3fzGPpjOkRoEYxTa6o5rdg/r0Y4ImO6//l/5FYyLP1UzP5EDIg9S+Yff6f8S7iczMh5rkV2pLkFAkEA3PU90Ntd8CRnMkc7PMUSaRTJBm/BLCHsVRBCX8oi2GPDiBGBBC6orNsvQOpnIYXLh6GOiCGTCZHYexvbMNVSIQJBAMsW8lwfB1ulXhYI9dNC2nNoJHnbsJ3LmKOt7Yd6jKzaXY5SppChgYLejhOZc9TE4zlUYvftaOv0drmx2q0hIMECQQCA7RgEpftKA/OzAp0t+E+lwNsLRmoQtjqP58zS1789Q/jzjEMbjZ4ePkZ0OlGy3b7EhSAFjpGdI9yM+NQMymwBAkAH1g76XJzBzvGEzT/eSRX0s6s7D0ZBpMduUtKcIB+R/NbJf8SGBjGmoLAdY8bKNHwX0+ICuMu4OuqT0rLWVbKi',
  // 响应拦截
  onResponseInterceptor: async (response: Response) => {
    // console.log("响应拦截", response);
    // 响应成功
    if (response.status === 200) {
      const json: APIResponse<any> = await response.json();
      const { resultCode, resultMsg } = json;
      if (resultCode != "000000") {
        ElMessage.error(resultMsg || "服务请求失败");
      } else {
        json.resultCode = "0";
      }
      return json;
    } else if (response.status === 401) {
      ElMessage.error("登录失效，请重新登录");
    } else {
      ElMessage.error("请求失败，请稍后再试" + response.status);
    }

    return response;
  },
});

/**
 * 判断本地记录是否存在
 */
const userStore = piniaUserRecord();
watch(
  () => {
    return userStore.isLoggedIn;
  },
  (loginStatus) => {
    // 已经登录
    if (loginStatus) {
      const { keyId, keySecret } = userStore.getUserInfo;
      VideIotServer.getInstance().login(keyId!, keySecret!);
    }
  },
  {
    immediate: true,
  }
);
</script>
