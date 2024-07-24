/// <reference path="./types/index.d.ts" />
import VideIotServer from "../miniprogram/utils/videiot-server";

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    videiotApi?: VideIotServer
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}