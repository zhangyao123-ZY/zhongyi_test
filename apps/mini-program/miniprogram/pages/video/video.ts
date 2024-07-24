import { URLSearchParams } from "../../utils/util";
import { DeviceListItem, DeviceChannelInfo } from "../../utils/videiot-server/types";

// pages/video/video.ts
Page<
  {
    deviceInfo: Omit<DeviceListItem, 'channelList'> & DeviceChannelInfo  
  },
  any
>({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    storageType: 'cloud', // cloud sdCard
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(deviceInfo) {
    console.log(`deviceInfo`, deviceInfo);
    this.setData({
      deviceInfo
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  switchStorageType(event) {
    const currentTarget = event.currentTarget;
    const dataset = currentTarget.dataset;
    const { type } = dataset;
    this.setData({
      storageType: type
    });
  },

  onGoBack() {
    wx.navigateBack();
  },

  onGoToSetting() {
    const { deviceSn, channelSn } = this.data.deviceInfo;
    // 修改大华设备通道名称时需要传通道号
    wx.navigateTo({
      url: `/pages/device/setting/index?deviceSn=${deviceSn}&channelSn=${channelSn}`
    });
  }
})