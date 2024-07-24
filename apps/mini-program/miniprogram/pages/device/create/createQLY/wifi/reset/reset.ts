import Dialog from '@vant/weapp/dialog/dialog';
import { AddDeviceBody } from "../../../../../../utils/videiot-server/types";
import { URLSearchParams } from '../../../../../../utils/util';

// pages/device/create/createQLY/wifi/reset/reset.ts
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

  showError() {
    Dialog.alert({
      title: '未听到“嘀”声',
      message: '摄像机未重置成功\n确保摄像机接通电源，指示灯亮起,重试长按“SET“按键,直到“嘀”声响起。\n\n摄像机可能硬件故障\n1.可前往当地营业厅寻求帮助\n2.可拨打客服热线:400-110-0866',
    }).then(() => {
      // on close
    });
  },

  goToConfig() {
    const queryString = new URLSearchParams(this.data.createForm);
    wx.navigateTo({
      url: `/pages/device/create/createQLY/wifi/config/config?${queryString}`
    });
  }
})