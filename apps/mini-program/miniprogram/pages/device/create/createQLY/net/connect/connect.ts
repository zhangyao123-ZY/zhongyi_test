// pages/device/create/createQLY/net/connect/connect.ts
import Dialog from '@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    connectPercent: 0
  },

  timer: 0,
  leftSeconds: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const randomSeconds = Math.ceil(Math.random() * 120);
    this.leftSeconds = randomSeconds < 90 ? 90 : randomSeconds;
    const totalSeconds = this.leftSeconds;

    this.timer && clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.leftSeconds > 0) {
        this.leftSeconds--;
      }
      if (this.leftSeconds <= 0) {
        this.timer && clearInterval(this.timer);
        wx.reLaunch({
          url: '/pages/device/create/result/result?status=success',
        });
      } else if (this.leftSeconds <= 20) {
        this.setData({
          connectPercent: 90
        });
      } else if (this.leftSeconds <= 30) {
        this.setData({
          connectPercent: 88
        });
      } else if (this.leftSeconds <= 60) {
        this.setData({
          connectPercent: 80
        });
      } else if (this.leftSeconds <= 76) {
        this.setData({
          connectPercent: 60
        });
      }  else if (this.leftSeconds <= 88) {
        this.setData({
          connectPercent: 46
        });
      } else if (this.leftSeconds <= 90) {
        this.setData({
          connectPercent: 40
        });
      } else {
        this.setData({
          connectPercent: totalSeconds - this.leftSeconds
        });
      }
    }, 5e2);
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

  showError() {
    Dialog.alert({
      title: '添加遇到问题',
      message: '红灯长亮\n1.确保摄像机需要连接的网络是正常通信的;\n2.网络异常，摄像机无法连接服务器\n\n语音提示Wi-Fi密码错误\n确保输入正确的2.4G频段Wi-Fi名称和密码',
    }).then(() => {
      // on close
    });
  },
})