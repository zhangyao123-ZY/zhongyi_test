import { URLSearchParams } from '../../../../../../utils/util';
import { AddDeviceBody } from '../../../../../../utils/videiot-server/types';

// pages/device/create/createQLY/net/reset/reset.ts
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
    },

    showCreateModeActions: false,
    createModeActions: [
      {
        name: '扫码',
        value: '0',
      },
      {
        name: 'MAC地址',
        value: '1',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(createForm) {
    this.setData({
      createForm
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

  showCreateMode() {
    this.setData({ showCreateModeActions: true });
  },

  hideSelectCreateMode() {
    this.setData({ showCreateModeActions: false });
  },

  onSelectCreateMode(event) {
    const { value } = event.detail;
    const queryString = new URLSearchParams(this.data.createForm);
    wx.navigateTo({
      url: `/pages/device/create/createQLY/net/${
        value === '0' ? 'scan/scan' : 'mac/mac'
      }?${queryString}`
    });
  }
})