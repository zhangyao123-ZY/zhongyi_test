// pages/login/login.ts
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appid: '3d534491d3964a54b7f2db5e383bdf9d',
    appidError: '',
    appkey: '3b71de1385404987',
    appkeyError: '',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  login() {
    console.log(`login`);
    const { appid, appkey } = this.data;
    if (!appid) {
      return this.setData({
        appidError: '请输入 appid'
      });
    } else {
      if (this.data.appidError) {
        this.setData({
          appidError: ''
        })
      }
    }
    if (!appkey) {
      return this.setData({
        appkeyError: '请输入 key'
      });
    } else {
      if (this.data.appkeyError) {
        this.setData({
          appkeyError: ''
        })
      }
    }
    app.globalData.videiotApi.login(appid, appkey);
    wx.switchTab({
      url: '/pages/device/list/list'
    });
    // wx.navigateTo({
    //   url: '/pages/device/setting/info/info'
    // });
  }
})