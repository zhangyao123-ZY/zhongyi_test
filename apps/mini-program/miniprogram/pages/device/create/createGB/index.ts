// pages/device/create/createGB/index.ts
import Toast from '@vant/weapp/toast/toast';
import { AddDeviceBody } from '../../../../utils/videiot-server/types';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceName: '',
    channelCount: 0,
    deviceType: 0,
    deviceTypeName: '',
    platformId: '',

    showDeviceType: false,
    deviceTypeActions: [
      {
        name: 'IPC',
        value: 1,
      },
      {
        name: 'NVR',
        value: 2,
      },
    ],

    showV6Actions: false,
    isSupportV6: '0',
    isSupportV6Actions: [
      {
        name: '支持',
        value: '1',
      },
      {
        name: '不支持',
        value: '0',
      },
    ],

    showIntranetActions: false,
    isIntranet: 0,
    isIntranetActions: [
      {
        name: '是',
        value: 1,
      },
      {
        name: '否',
        value: 0,
      },
    ]
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

  onChange(event) {
    this.setData({
      deviceName: event.detail
    });
  },

  showSelectDeviceType() {
    this.setData({ showDeviceType: true });
  },

  hideSelectDeviceType() {
    this.setData({ showDeviceType: false });
  },

  onSelectDeivceType(event) {
    console.log(event.detail);
    const { name, value } = event.detail;
    this.setData({
      deviceType: value,
      deviceTypeName: name
    });
  },

  showSelectIsSupportV6() {
    this.setData({ showV6Actions: true });
  },

  hideSelectIsSupportV6() {
    this.setData({ showV6Actions: false });
  },

  onSelectIsSupportV6(event) {
    console.log(event.detail);
    const { value } = event.detail;
    this.setData({
      isSupportV6: value
    });
  },

  showSelectIsIntranet() {
    this.setData({ showIntranetActions: true });
  },

  hideSelectIsIntranet() {
    this.setData({ showIntranetActions: false });
  },

  onSelectIsIntranet(event) {
    console.log(event.detail);
    const { value } = event.detail;
    this.setData({
      isIntranet: value
    });
  },

  // 创建国标设备
  async createGBDevice() {
    const {
      deviceName,
      channelCount,
      deviceType,
      platformId,
      isIntranet,
      isSupportV6
    } = this.data;
    if (!deviceName) {
      return Toast.fail('请输入设备名称，字数最大不超过40！');
    }
    if (!deviceType) {
      return Toast.fail('请选择设备类型！');
    }
    // NVR deviceType=2时必传 通道数量
    if (deviceType === 2 && !channelCount) {
      return Toast.fail('请输入 NVR 通道数量！');
    }

    const reqBody: AddDeviceBody = {
      protocol: 1,
      deviceName,
      deviceType,
      platformId,
      isIntranet,
      isSupportV6
    };
    if (deviceType === 2) {
      reqBody.channelCount = channelCount;
    }
    const { resultCode, resultMsg, data } = await app.globalData.videiotApi.addDevice(reqBody);
    if (resultCode === '000000') {
      console.log(`data`, data);
      wx.navigateBack();
    } else {
      Toast.fail(resultMsg);
    }
  }
})