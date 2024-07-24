// pages/device/create/createQLY/net/scan/scan.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },

  error(e) {
    console.log(e.detail)
  },

  onScanCode(e) {
    const detail = e.detail;
    if (
      detail.type === "QR_CODE" ||
      detail.type === "barcode"
    ) {
      const result = detail.result;
      if (result.length === 12) {
        wx.navigateTo({
          url: `/pages/device/create/createQLY/net/mac/mac?mac=${result}`
        });
      }
    }
    console.log(`onScanCode`, e);
  }
})