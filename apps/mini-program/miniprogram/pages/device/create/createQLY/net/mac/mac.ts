// pages/device/create/createQLY/net/mac/mac.ts
import Toast from '@vant/weapp/toast/toast';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceName: '',
    mac: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.mac) {
      this.setData({
        mac: options.mac
      });
    }
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

  async createWithMac() {
    const { deviceName, mac } = this.data;
    if (!deviceName && deviceName.length > 40) {
      return Toast.fail('请输入不大于40位的设备名称！');
    }
    if (!mac && mac.length < 12) {
      return Toast.fail('请输入不大于12位的 MAC 地址！');
    }
    // send request
    const { resultCode, resultMsg } = await app.globalData.videiotApi.addDevice({
      protocol: 2,
      loginType: 1,
      deviceName,
      mac
    });
    if (resultCode === '000000') {
      wx.navigateTo({
        url: `/pages/device/create/createQLY/net/connect/connect`
      });
    } else {
      Toast.fail(resultMsg);
    }
  }

})