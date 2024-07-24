// components/custom-tab-bar.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    active: 0,
    list: [
      {
        icon: {
          normal: '../assets/svg/qianliyan.svg',
          active: '../assets/svg/qianliyan-active.svg'
        },
        text: '千里眼',
        url: '/pages/device/list/list'
      },
      {
        icon: {
          normal: '../assets/svg/mine.svg',
          active: '../assets/svg/mine-active.svg'
        },
        text: '我的',
        url: '/pages/mine/mine'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onChange(event) {
      console.log(`event.detail`, event.detail);
      this.setData({ active: event.detail });
      wx.switchTab({
        url: this.data.list[event.detail].url
      });
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page?.route}`)
      });
    },

    show() {
      this.setData({
        show: true
      });
    },

    hide() {
      this.setData({
        show: false
      });
    }

  }
})