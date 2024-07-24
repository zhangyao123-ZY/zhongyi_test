import Toast from '@vant/weapp/toast/toast';
import { URLSearchParams } from "../../../utils/util";
import { DeviceListItem, DeviceChannelInfo } from "../../../utils/videiot-server/types";

// pages/device/setting/index.ts
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceSn: '',
    channelSn: '',

    deviceName: '',
    gaChannelCode: '',
    // 修改大华设备通道名称时需要传通道号
    channelId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(deviceInfo) {
    console.log(`deviceInfo`, deviceInfo);
    const { deviceSn, channelSn } = deviceInfo;
    this.setData({
      deviceSn,
      channelSn
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log(`onReady data`);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(`onShow data`);
    this.getDeviceInfo();
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

  async getDeviceInfo() {
    wx.showLoading({
      title: '获取设备以及通道信息'
    });
    try {
      const { resultCode, resultMsg, data } = await app.globalData.videiotApi.getDeviceInfo(this.data.deviceSn);
      if (resultCode === '000000') {
        const { channelList } = data;
        const channelInfo = channelList.find(channel => channel.channelSn === this.data.channelSn);
        this.setData({
          deviceName: data.deviceName,
          // 修改大华设备通道名称时需要传通道号
          channelId: channelInfo.channelId,
          gaChannelCode: channelInfo.gaChannelCode
        });
      } else {
        Toast.fail(resultMsg);
      }
    } catch (error) {
      console.error(`获取设备列表失败！`, error);
      Toast.fail(`获取设备列表失败！`);
    } finally {
      wx.hideLoading();
    }
  },

  onDeviceRename() {
    wx.navigateTo({
      url: `/pages/device/setting/rename/rename?deviceSn=${this.data.deviceSn}&deviceName=${this.data.deviceName}`
    });
  },

  onGetDeviceInfo() {
    wx.navigateTo({
      url: `/pages/device/setting/info/info?deviceSn=${this.data.deviceSn}&channelSn=${this.data.channelSn}`
    });
  },

  onGetDevice1400Info() {
    wx.navigateTo({
      url: `/pages/device/setting/1400info/1400info?gaChannelCode=${this.data.gaChannelCode}`
    });
  }
});