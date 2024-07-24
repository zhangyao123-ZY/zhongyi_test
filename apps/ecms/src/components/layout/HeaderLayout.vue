<!--
 * 页面 header 布局
 * @author: web_develop
 * @since: 2024-07-15
 * HeaderLayout.vue
-->
<template>
  <div class="w-full h-full flex items-center justify-between">
    <div class="flex items-center">
      <!-- logo -->
      <div class="flex items-center space-x-2">
        <img
          class="w-12 h-12"
          src="@/assets/images/logo.png"
          draggable="false"
          alt="logo"
        />
        <span class="text-basic-text text-lg">视联网联调测试</span>
      </div>
      <!-- 导航 -->
    </div>
    <!-- 用户信息 -->
    <div v-if="isLogin">
      <el-popover :width="320" trigger="click" popper-class="p-0">
        <template #reference>
          <el-avatar
            :size="40"
            :src="userInfo.useAvatar"
            class="cursor-pointer"
          >
            <img src="@/assets/images/img-error.png" draggable="false" />
          </el-avatar>
        </template>
        <template #default>
          <div>
            <h4
              class="border-b border-b-[#D8D8D8] px-4 py-2 text-lg text-basic-text"
            >
              个人信息
            </h4>
            <ul class="text-basic-text text-base p-4">
              <li>
                <span>租户名称：</span>
                <span>{{ userInfo.userName }}</span>
              </li>
            </ul>
            <div class="px-4 pb-3 flex justify-end">
              <el-button
                type="primary"
                link
                class="text-base"
                @click="eventLoginoutFn"
                >退出登录</el-button
              >
            </div>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { piniaUserRecord } from "@/store/modules/user";
import { ElMessageBox } from "element-plus";
import VideIotServer from "videiot-server";

const userStore = piniaUserRecord();

// 是否已经登录
const isLogin = computed(() => userStore.isLoggedIn);

// 登录信息
const userInfo = computed(() => userStore.getUserInfo);

/**
 * 退出登录
 */
const router = useRouter();
const eventLoginoutFn = () => {
  ElMessageBox.confirm("确定退出登录吗？", "提示", {
    customClass: "message_box_custom",
  }).then(() => {
    VideIotServer.getInstance().logout();
    userStore.clearUserInfo();
    router.replace("/login");
  });
};
</script>
