// pages/device/setting/info/info.ts
import Toast from '@vant/weapp/toast/toast';
import { DeviceChannelInfo, DeviceListItem } from "../../../../utils/videiot-server/types";

const app = getApp();
Page<{
  deviceInfo: Omit<DeviceListItem, 'channelList'> & DeviceChannelInfo
}, any>({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    channelInfo: {},
  },

  deviceSn: '',
  channelSn: '',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(data) {
    const { deviceSn, channelSn } = data;
    this.deviceSn = deviceSn;
    this.channelSn = channelSn;
    this.getDeviceInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {

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
      const { resultCode, resultMsg, data } = await app.globalData.videiotApi.getDeviceInfo(this.deviceSn);
      if (resultCode === '000000') {
        const { channelList } = data;
        const channelInfo = channelList.find(channel => channel.channelSn === this.channelSn);
        this.setData({
          deviceInfo: {
            ...data,
            loginPwd: app.globalData.videiotApi.decryptRSAprivatekey(data.loginPwd)
          },
          channelInfo
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

  copy(e) {
    const currentTarget = e.currentTarget;
    const { dataset } = currentTarget;
    const { value } = dataset;
    wx.setClipboardData({
      data: value,
      success (res) {}
    })
  }
})