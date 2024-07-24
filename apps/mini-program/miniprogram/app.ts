// app.ts
import { IAppOption } from '../typings';
import VideIotServer from './utils/videiot-server/index';

const videiotApi = VideIotServer.getInstance();

App<IAppOption>({
  globalData: {
    videiotApi
  },
  onLaunch() {
    // 
    // const appId = '3d534491d3964a54b7f2db5e383bdf9d';
    // const secretKey = '3b71de1385404987';
    const privateKey = 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMvNqw+s52/LwqJXRbnOBw0PAhUTQdLGBEz4UniaqBoCsHiJU2WRRYc9kE4q/RTk43kryzZVRN/SFCkVz8mLW4MlC5eWGxDGxepNHvEeFEZI8HDzkM1ClpmEN7RBFXk1zvzFAOGZvAgZgP5U6g4U0n+k5mM5TqDLjdNhHvrvqHOlAgMBAAECgYEAypcw840iJvy7BtuQQUpvseh4XnDdHuOehNDYUnESp4CC4d9I2o8VOYHWQA31tF5vTRVelS0gIQnY5pp7ClMQbD/5ZldJM5tHctlYfVKxBvbiHpumNZjcwfEmWOh3/vG7gQmvvuzYc8pWygPdHms304zvAyjvUc974jjUBIR6NYECQQDsH/YPDEvWo3fzGPpjOkRoEYxTa6o5rdg/r0Y4ImO6//l/5FYyLP1UzP5EDIg9S+Yff6f8S7iczMh5rkV2pLkFAkEA3PU90Ntd8CRnMkc7PMUSaRTJBm/BLCHsVRBCX8oi2GPDiBGBBC6orNsvQOpnIYXLh6GOiCGTCZHYexvbMNVSIQJBAMsW8lwfB1ulXhYI9dNC2nNoJHnbsJ3LmKOt7Yd6jKzaXY5SppChgYLejhOZc9TE4zlUYvftaOv0drmx2q0hIMECQQCA7RgEpftKA/OzAp0t+E+lwNsLRmoQtjqP58zS1789Q/jzjEMbjZ4ePkZ0OlGy3b7EhSAFjpGdI9yM+NQMymwBAkAH1g76XJzBzvGEzT/eSRX0s6s7D0ZBpMduUtKcIB+R/NbJf8SGBjGmoLAdY8bKNHwX0+ICuMu4OuqT0rLWVbKi';
    // const baseUrl: string = 'https://openapi.videiot.cn:8081';
    // const baseUrl: string = 'http://localhost:5173/api';
    const baseUrl: string = 'http://192.168.199.121:5173/api';
    videiotApi.init(baseUrl, {
      RSApriKey: privateKey
    });

    // // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    const {
      windowWidth,
      windowHeight,
      statusBarHeight,
      safeArea,
    } = wx.getSystemInfoSync();

    console.log(`statusBarHeight`, statusBarHeight);
    console.log(`windowHeight`, windowHeight);
    console.log(`safeArea`, safeArea);

    // // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res.code)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   },
    // })
  },
})