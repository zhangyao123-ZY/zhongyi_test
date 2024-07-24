import { UserInfoInterface } from "@/types/user";

/**
 * 用户信息相关本地记录
 */
export interface UserRecordInterface {
  userInfo: string | undefined;
}

export const piniaUserRecord = defineStore("PINIA_USER_RECORD", {
  state: (): UserRecordInterface => ({
    // 用户基本信息
    userInfo: localStorage.getItem("VIDEIOT_USER_RECORD_INFO") || undefined,
  }),
  getters: {
    /**
     * 获取用户信息
     */
    getUserInfo: (state) => {
      if (state.userInfo) {
        return JSON.parse(state.userInfo) as UserInfoInterface;
      }
      return {} as UserInfoInterface;
    },

    /**
     * 获取用户的 appid
     */
    getAppId: (state) => {
      const userInfo = state.userInfo ? JSON.parse(state.userInfo) as UserInfoInterface : null;
      return userInfo?.keyId || "";
    },
    /**
     * 是否已经登录
     */
    isLoggedIn: (state) => !!state.userInfo,
  },
  actions: {
    /**
     * 设置用户信息
     */
    setUserInfo(info: UserInfoInterface): void {
      const oInfo = JSON.stringify(info);
      localStorage.setItem("VIDEIOT_USER_RECORD_INFO", oInfo);
      this.userInfo = oInfo;
    } /**
     * 清除用户信息
     */,
    clearUserInfo(): void {
      localStorage.removeItem("VIDEIOT_USER_RECORD_INFO");
      this.userInfo = undefined;
    },
  },
});
