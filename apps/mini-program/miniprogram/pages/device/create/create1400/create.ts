// pages/device/create/create1400/create.ts
import Toast from '@vant/weapp/toast/toast';
import { AddDevice1400Body } from '../../../../utils/videiot-server/types';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    channelSn: '',
    name: '',
    account: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { channelSn } = options;
    this.setData({
      channelSn,
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

  async create1400() {
    const { channelSn, name, account, password } = this.data;
    if (!name) {
      return Toast.fail('请输入设备名称，字数最大不超过40！');
    }
    if (!account) {
      return Toast.fail('请输入 1400 账号！');
    }
    if (!password) {
      return Toast.fail('请输入 1400 秘密！');
    }
    const reqBody: AddDevice1400Body = {
      channelSn, name, account, password
    };
    const { resultCode, resultMsg, data } = await app.globalData.videiotApi.addDevice1400(reqBody);
    if (resultCode === '000000') {
      Toast.success({
        message: '添加 1400 设备成功',
        onClose: () => {
          wx.navigateBack();
        },
      });
    } else {
      Toast.fail(resultMsg);
    }
  },
})