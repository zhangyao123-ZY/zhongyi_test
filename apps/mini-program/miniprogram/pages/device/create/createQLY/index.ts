import { URLSearchParams } from "../../../../utils/util";
import { AddDeviceBody } from "../../../../utils/videiot-server/types";

// pages/device/create/createQLY/index.ts
Page<
  {
    createForm: AddDeviceBody
  },
  any
>({

  /**
   * 页面的初始数据
   */
  data: {
    createForm: {
      protocol: 2
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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

  createByWifi() {
    this.setData({
      'createForm.loginType': 2
    });
    const queryString = new URLSearchParams(this.data.createForm);
    wx.navigateTo({
      url: `/pages/device/create/createQLY/wifi/config/config?${queryString}`
      // url: `/pages/device/create/createQLY/wifi/reset/reset?${queryString}`
    });
  },

  createNetwork() {
    this.setData({
      'createForm.loginType': 1
    });
    const queryString = new URLSearchParams(this.data.createForm);
    wx.navigateTo({
      url: `/pages/device/create/createQLY/net/reset/reset?${queryString}`
    });
  }
})