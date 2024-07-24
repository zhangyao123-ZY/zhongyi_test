import Toast from '@vant/weapp/toast/toast';
import { Device1400Info } from "../../../../utils/videiot-server/types";

// pages/device/setting/1400info/1400info.ts
const app = getApp();
Page<
  {
    deviceInfo: Device1400Info
  }, any
>({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { gaChannelCode } = options;
    console.log(`gaChannelCode`, gaChannelCode);
    this.setData({
      'deviceInfo.gaChannelCode': gaChannelCode
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  async get1400DeviceInfo() {
    try {
      const { resultCode, resultMsg, data } = await app.globalData.videiotApi.getDevice1400Info(this.data.gaChannelCode);
      if (resultCode === '000000') {
        this.setData({
          deviceInfo: data
        });
      } else {
        Toast.fail(resultMsg);
      }
    } catch (error) {
      console.error(`获取1400设备信息失败！`, error);
      Toast.fail(`获取1400设备信息失败！`);
    }
  },
})