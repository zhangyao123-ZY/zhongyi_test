// pages/device/create/result/result.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '', // success failed
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { status } = options;
    this.setData({
      status
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

  done() {
    wx.switchTab({
      url: '/pages/device/list/list'
    });
  },
})