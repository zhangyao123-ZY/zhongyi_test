
import QRCode from 'qrcode-generator';
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import { AddDeviceBody } from "../../../../../../utils/videiot-server/types";

const app = getApp();

// pages/device/create/createQLY/wifi/config/config.ts
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
    step: 1, // 1 config 2 qrcode

    createForm: {
      protocol: 2,
      loginType: 2,
      deviceName: '',
      mac: '',
      wifiSsid: '',
      wifiPwd: '',
      // wifi密码加密方 式
      security: 4
    },
    BSSID: '',
    wifiPwd: '',
    deviceName: '',
    mac: '',

    isWifiSsidShow: false,
    wifiSsidActions: [],

    isWifiSecurityShow: false,
    wifiSecurityActions: [
      { name: '无密码', value: 0 },
      { name: 'WPA', value: 1 },
      { name: 'WPA2', value: 2 },
      { name: 'WEP', value: 3 },
      { name: 'WEP', value: 3 },
      { name: 'WPA/WPA2', value: 4 },
    ],
    wifiSecurityName: 'WPA/WPA2',

    qrCodeSrc: '',
  },

  timer: 0,
  qrCodeIndex: 0,
  qrCodeList: [],

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(createForm) {
    this.setData({
      createForm
    });
  },

  onDeviceNameChange(e) {
    const { value } = e.detail;
    this.setData({
      'createForm.deviceName': value,
      'deviceName': value
    });
  },

  onMacChange(e) {
    const { value } = e.detail;
    this.setData({
      'createForm.mac': value,
      'mac': value
    });
  },

  onPwdChange(e) {
    const { value } = e.detail;
    this.setData({
      'createForm.wifiPwd': value,
      'wifiPwd': value
    });
  },

  getWifiList() {
    wx.getWifiList({
      success: (res) => {
        console.log(`res`, res);
        wx.onGetWifiList((res) => {
          console.log(`onGetWifiList`, res);
          const wifiList = res.wifiList
            .sort((a, b) => b.signalStrength - a.signalStrength)
            .map((item) => ({ name: item.SSID, ...item }));
          this.setData({
            wifiSsidActions: wifiList
          });
        })
      },
      fail(err) {
        console.error(err);
      }
    })
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

  showWifiSsid() {
    // 没有 Wi-Fi 列表需要去请求
    if (this.data.wifiSsidActions.length === 0) {
      wx.startWifi({
        success: this.getWifiList,
        fail(err) {
          console.error(err);
        }
      });

      wx.onGetWifiList((res) => {
        console.log(`onGetWifiList`, res);
      });
    }
    this.setData({
      isWifiSsidShow: true
    });
  },

  hideWifiSsid() {
    this.setData({
      isWifiSsidShow: false
    });
  },

  onSelectWifiSsid(event) {
    console.log(event.detail);
    const selectWifi = event.detail;
    this.setData({
      'createForm.wifiSsid': selectWifi.SSID,
      BSSID: selectWifi.BSSID
    });
  },

  showWifiSecurity() {
    this.setData({
      isWifiSecurityShow: true
    });
  },

  hideWifiSecurity() {
    this.setData({
      isWifiSecurityShow: false
    });
  },

  onSelectWifiSecurity(event) {
    console.log(event.detail);
    const { name, value } = event.detail;
    this.setData({
      'createForm.security': value,
      wifiSecurityName: name
    });
  },

  async createDevice() {
    const { createForm } = this.data;
    if (!createForm.deviceName) {
      return Toast.fail('请输入设备名称！');
    }
    if (!createForm.mac) {
      return Toast.fail('请输入 MAC 地址！');
    }
    console.log(`createForm`, createForm);
    if (!createForm.wifiSsid) {
      return Toast.fail('请选择 Wi-Fi！');
    }
    console.log(`createForm`, createForm);
    // send request
    const { resultCode, resultMsg, data } = await app.globalData.videiotApi.addDevice(createForm);
    console.log(`xxxx addDevice`, resultCode, resultMsg);
    if (resultCode === '000000') {
      console.log(`data`, data);
      const { deviceSn, qrCode } = data;
      this.qrCodeIndex = 0;
      this.qrCodeList = qrCode;
      this.startStep2();
    } else {
      Toast.fail(resultMsg);
    }
  },

  startStep2() {
    try {
      this.setData({ step: 2 });
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        const qrCode = QRCode(4, 'L');
        qrCode.addData(this.qrCodeList[this.qrCodeIndex]);
        qrCode.make();
        const qrCodeData = qrCode.createDataURL();
        this.setData({
          qrCodeSrc: qrCodeData
        });
        if (this.qrCodeIndex < this.qrCodeList.length - 1) {
          this.qrCodeIndex++;
        } else {
          this.qrCodeIndex = 0;
        }
      }, 2e3);
    } catch(error) {
      console.log(`获取二维码失败`, error);
      Toast.fail(`获取二维码失败`);
    }
  },

  goToSuccess() {
    wx.navigateTo({
      url: '/pages/device/create/result/result?status=success',
    });
  },

  showError() {
    Dialog.alert({
      title: '未听到“嘀”声',
      message: '1.请确保指示灯红灯闪烁。\n2.请确保二维码和摄像机之间的距离在10-20厘米(4-8英寸)',
    }).then(() => {
      // on close
    });
  }
})