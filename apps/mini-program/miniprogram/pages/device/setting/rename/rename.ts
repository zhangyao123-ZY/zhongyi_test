import Toast from "../../../../miniprogram_npm/@vant/weapp/toast/toast";

// pages/device/setting/rename/rename.ts
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceSn: '',
    deviceName: '',
    channelId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { deviceSn, deviceName, channelId } = options;
    this.setData({
      deviceSn,
      deviceName,
      // 修改大华设备通道名称时需要传通道号
      channelId
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

  async updateDeviceName() {
    const { deviceSn, deviceName, channelId } = this.data;
    if (deviceName.length <= 0) {
      return Toast.fail(`请输入设备名称`);
    }
    console.log(`updateDeviceName`, deviceName);
    try {
      const { resultCode, resultMsg, data } = await app.globalData.videiotApi.updateDeviceName({
        deviceSn,
        deviceName,
        channelId,
      });
      if (resultCode === '000000') {
        Toast.success(`修改成功！`);
        wx.navigateBack();
      } else {
        Toast.fail(resultMsg);
      }
    } catch (error) {
      console.error(`获取设备列表失败！`, error);
      Toast.fail(`获取设备列表失败！`);
    }
  }
})