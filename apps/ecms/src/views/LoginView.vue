<!--
 * 登录页
 * @author: web_develop
 * @since: 2024-07-15
 * LoginView.vue
-->
<template>
  <div class="w-full h-full bg-white p-8">
    <div
      class="w-full h-full bg-[#F5F5F5] border border-[#C4C4C4] rounded-sm flex items-center justify-center"
    >
      <div class="bg-white rounded-sm px-[90px] py-[72px] login_custom">
        <div class="w-96 h-32 flex items-center">
          <el-form
            ref="ruleFormRef"
            size="large"
            :model="formData"
            :rules="formDataRules"
            hide-required-asterisk
            label-width="80px"
            label-position="left"
            class="w-full"
          >
            <template
              v-if="currentLoginType === LoginTypeEnum.KeyLogin"
              #default
            >
              <el-form-item label="租户 id" prop="userId">
                <el-input v-model.trim="formData.userId" placeholder="输入租户 id" />
              </el-form-item>
              <el-form-item label="key" prop="userKey">
                <el-input v-model.trim="formData.userKey" placeholder="请输入密钥" />
              </el-form-item>
            </template>
            <template
              v-else-if="currentLoginType === LoginTypeEnum.CodeLogin"
              #default
            >
              <el-form-item label="授权码" prop="userCode">
                <el-input
                  v-model.trim="formData.userCode"
                  placeholder="请输入授权码"
                />
              </el-form-item>
            </template>
          </el-form>
        </div>

        <div class="flex justify-end mb-5">
          <el-button
            type="primary"
            link
            class="text-base"
            @click="eventToggleLoginTypeFn"
          >
            <span v-if="currentLoginType === LoginTypeEnum.KeyLogin">
              授权码登录
            </span>
            <span v-else-if="currentLoginType === LoginTypeEnum.CodeLogin">
              账号登录
            </span>
          </el-button>
        </div>
        <div class="flex justify-center">
          <el-button
            type="primary"
            size="large"
            class="px-24"
            @click="eventSubmitLoginInfoFn"
            >登录</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { piniaUserRecord } from "@/store/modules/user";
import { FormInstance } from "element-plus";
import VideIotServer from "videiot-server";

/**
 * 登录类型
 */
enum LoginTypeEnum {
  KeyLogin,
  CodeLogin,
}

const currentLoginType = ref<LoginTypeEnum>(LoginTypeEnum.KeyLogin);
// 切换登录类型
const eventToggleLoginTypeFn = () => {
  if (currentLoginType.value === LoginTypeEnum.KeyLogin) {
    currentLoginType.value = LoginTypeEnum.CodeLogin;
  } else {
    currentLoginType.value = LoginTypeEnum.KeyLogin;
  }
  formData.userCode = "";
  formData.userKey = "";
  formData.userId = "";
};

/**
 * 表单
 */
const ruleFormRef = ref<FormInstance>();
const formData = reactive({
  // 租户 id
  userId: "3d534491d3964a54b7f2db5e383bdf9d",
  // key
  userKey: "3b71de1385404987",
  // 授权码
  userCode: "",
});
const formDataRules = {
  userId: [
    {
      required: true,
      message: "请输入租户 id",
      trigger: "blur",
    },
  ],
  userKey: [
    {
      required: true,
      message: "请输入密钥",
      trigger: "blur",
    },
  ],
  userCode: [
    {
      required: true,
      message: "请输入授权码",
      trigger: "blur",
    },
  ],
};

/**
 * 登录
 */
const userStore = piniaUserRecord();
const router = useRouter();
const eventSubmitLoginInfoFn = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { userCode, userId, userKey } = formData;
      // console.log("登录", userCode, userId, userKey);
      if(currentLoginType.value === LoginTypeEnum.KeyLogin) {
        VideIotServer.getInstance().login(userId, userKey);
      }
      // 记录登录信息
      userStore.setUserInfo({
        userName: "",
        keyId: userId,
        keySecret: userKey,
      });
      // 前往首页
      router.replace("/");
    }
  });
};
</script>

<style lang="scss" scoped>
.login_custom {
  :deep(.el-form) {
    .el-form-item {
      .el-form-item__label {
        @apply text-basic-text font-normal text-lg leading-10;
      }
      .el-form-item__content {
        > .el-input {
          .el-input__wrapper {
            .el-input__inner {
              @apply font-normal placeholder:text-[#D9D9D9];
            }
          }
        }
      }
    }
  }
}
</style>
