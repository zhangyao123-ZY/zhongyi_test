// pages/device/create/create1400/index.ts
import Toast from '@vant/weapp/toast/toast';
import { PaginationBody } from '../../../../utils/videiot-server/types';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    deviceList: [],
  },

  page: 1,
  totalPage: 1,
  pageSize: 10,

  // 折叠面板展开
  onCollapseChange(event) {
    this.setData({
      activeNames: event.detail,
    });
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
    this.page = 1;
    this.getAllDevices();
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

  async getAllDevices() {
    if (this.page <= this.totalPage) {
      await this.getDeviceList();
      this.page++;
      await this.getAllDevices();
    }
  },

  async getDeviceList() {
    wx.showLoading({
      title: '获取列表中'
    });
    try {
      const page = this.page;
      const pageSize = this.pageSize;
      // 请求列表
      const reqBody: PaginationBody = {
        page,
        pageSize
      };
      const { resultCode, resultMsg, data, total } = await app.globalData.videiotApi.getDeviceList(reqBody);
      if (resultCode === '000000') {
        this.totalPage = Math.ceil(total / this.pageSize);
        const deviceList = this.page === 1 ? data : this.data.deviceList.concat(data);
        this.setData({
          deviceList
        });
      } else {
        Toast.fail(resultMsg);
      }
    } catch(err) {
      console.error(`获取设备列表失败！`, err);
      Toast.fail(`获取设备列表失败！`);
    } finally {
      wx.hideLoading();
    }
  },

  goToCreate1400(event) {
    const currentTarget = event.currentTarget;
    const dataset = currentTarget.dataset;
    console.log(`dataset`, dataset);
    const { csn } = dataset;
    console.log(`csn`, csn);
    wx.navigateTo({
      url: `/pages/device/create/create1400/create?channelSn=${csn}`
    });
  }

})