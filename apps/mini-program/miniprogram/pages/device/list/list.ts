// pages/device/list/list.ts
import Toast from '@vant/weapp/toast/toast';
import { URLSearchParams } from '../../../utils/util';
import { DeviceChannelInfo, DeviceListItem, PaginationBody } from "../../../utils/videiot-server/types";

const app = getApp();
Page<{
  channelList: Array<Omit<DeviceListItem, 'channelList'> & DeviceChannelInfo>;
  [key: string]: any;
}, {
  currentDeviceFilter: 'all' | 'online' | 'offline';
  allChannelList: Array<Omit<DeviceListItem, 'channelList'> & DeviceChannelInfo>;
  [key: string]: any;
}>({

  /**
   * 页面的初始数据
   */
  data: {
    showCreateDeviceType: false,
    createDeviceActions: [
      {
        name: '国标协议',
        value: 'GB',
      },
      {
        name: '千里眼协议',
        value: 'QLY',
      },
      {
        name: '1400协议',
        value: '1400',
      },
    ],

    showDeviceFilter: false,
    deviceFilterActions: [
      {
        name: '全部设备',
        value: 'all'
      },
      {
        name: '在线设备',
        value: 'online'
      },
      {
        name: '离线设备',
        value: 'offline'
      }
    ],
    listLayout: 'card', // card / list

    searchInputIsShow: false,
    searchInput: '',

    // from allChannelList
    channelList: []
  },

  page: 1,
  totalPage: 1,
  pageSize: 10,

  currentDeviceFilter: 'all', // all online offline

  allChannelList: [],

  // 如果不为空说明当前列表为该设备的通道
  searchDeviceSn: '',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    this.page = 1;
    this.getChannelList();
    // // mock data
    // const list = new Array(16);
    // list.fill({})
    // this.allChannelList = list.map((item, index) => {
    //   const info: Omit<DeviceListItem, 'channelList'> & DeviceChannelInfo = {
    //     deviceSn: `${Math.random() * Math.pow(10, 9)}`,
    //     deviceName: `通道名称${index}`,
    //     protocol: [1, 2, 5, 6, 7, 8][Math.floor(Math.random() * 6)],
    //     deviceType: [1, 2][Math.floor(Math.random() * 2)],
    //     isIntranet: [1, 2][Math.floor(Math.random() * 2)],
    //     isSubDomain: [1, 2][Math.floor(Math.random() * 2)],
    //     channelSn: `xxxx${index}`,
    //     channelId: Math.random() * Math.pow(10, 9),
    //     channelName: `通道名称${index}`,
    //     onlineStatus: [0, 1, 2][Math.floor(Math.random() * 3)],
    //     gaChannelCode: `${Math.random() * Math.pow(10, 9)}`
    //   };
    //   return info;
    // });
    // this._updateDeviceListByFilter();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    this.getTabBar().init();
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
  async onPullDownRefresh() {
    if (this.searchDeviceSn) {
      wx.stopPullDownRefresh();
      return;
    }
    try {
      this.page = 1;
      await this.getChannelList();
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  async getChannelList() {
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
        const channelList: Array<Omit<DeviceListItem, 'channelList'> & DeviceChannelInfo> = [];
        data.forEach((device: DeviceListItem) => {
          device.channelList?.forEach(channel => {
            channelList.push({
              ...device,
              ...channel
            });
          });
        });
        this.allChannelList = this.page === 1 ? channelList : [...this.allChannelList, ...channelList];
        console.log(`this.allChannelList.length`, this.allChannelList.length);
        this._updateDeviceListByFilter();
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

  getNextPage() {
    if (this.searchDeviceSn) return;
    if (this.page < this.totalPage) {
      this.page += 1;
      this.getChannelList();
    }
  },

  goToVideo(event) {
    const currentTarget = event.currentTarget;
    const dataset = currentTarget.dataset;
    console.log(`event`, event);
    const queryString = new URLSearchParams(dataset.info);
    wx.navigateTo({
      url: `/pages/video/video?${queryString}`,
    });
  },

  showSearchInput() {
    this.setData({
      searchInputIsShow: true
    });
  },

  async getDeivceInfo(deviceSn: string) {
    this.searchDeviceSn = deviceSn;
    const { resultCode, resultMsg, data } = await app.globalData.videiotApi.getDeviceInfo(deviceSn);
    if (resultCode === '000000') {
      const channelList: Array<Omit<DeviceListItem, 'channelList'> & DeviceChannelInfo> = [];
      data.channelList.forEach(channel => {
        channelList.push({
          ...data,
          ...channel
        });
      });
      this.allChannelList = channelList;
      console.log(`this.allChannelList.length`, this.allChannelList.length);
      this._updateDeviceListByFilter();
    } else {
      Toast.fail(resultMsg);
    }
  },

  onSearch() {
    console.log(this.data.searchInput);
    this.allChannelList = [];
    this.currentDeviceFilter = 'all'; // all online offline
    if (this.data.searchInput === '') {
      this.searchDeviceSn = '';
      this.page = 1;
      this.totalPage = 1;
      this.getChannelList();
    } else {
      this.getDeivceInfo(this.data.searchInput);
    }
  },

  onCancel() {
    this.setData({
      searchInputIsShow: false,
      searchInput: '',
    });
  },

  toggleLayout() {
    this.setData({
      listLayout: this.data.listLayout === 'card' ? 'list' : 'card'
    });
  },

  showCreateDevice() {
    this.getTabBar().hide();
    this.setData({ showCreateDeviceType: true });
  },

  onCreateDeivceClose() {
    this.setData({ showCreateDeviceType: false });
    this.getTabBar().show();
  },

  onSelectCreateDeivceType(event) {
    console.log(event.detail);
    const { value } = event.detail;
    console.log(`path`, `/pages/device/create/create${value}`);
    wx.navigateTo({
      url: `/pages/device/create/create${value}/index`
    });
  },

  showDeviceFilter() {
    this.getTabBar().hide();
    this.setData({ showDeviceFilter: true });
  },

  onDeivceFilterClose() {
    this.setData({ showDeviceFilter: false });
    this.getTabBar().show();
  },

  onSelectDeivceFilter(event) {
    console.log(event.detail);
    const { value } = event.detail;
    this.currentDeviceFilter = value;
    this._updateDeviceListByFilter();
  },

  _updateDeviceListByFilter() {
    const channelList = this.allChannelList.filter(item => {
      switch(this.currentDeviceFilter) {
        case 'all':
          return true;
        case 'online':
          return item.onlineStatus === 1;
        case 'offline':
          return item.onlineStatus !== 1;
      }
    });
    this.setData({
      channelList
    });
  }
})