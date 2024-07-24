import CryptoJS from 'crypto-js';
import JSEncrypt from "./jsencrypt.min";

import WXRequestClient from './core/WXRequestClient';
import {
  AddDevice1400Body,
  AddDevice1400Response,
  AddDeviceBody,
  AddDeviceResponse,
  CreateDeviceChannelBody,
  CreateDeviceChannelResponse,
  DeleteDeviceBody,
  Device1400Info,
  DeviceInfo,
  DeviceListItem,
  DeviceNodeInfo,
  PaginationBody,
  UpdateDeviceNameBody,
  getDeviceThumbnailBody
} from './types';
import { APIResponse, RequestOptions } from './core/types';

export default class VideIotServer {
  private static _instance: VideIotServer;

  static getInstance(): VideIotServer {
    if (!VideIotServer._instance) {
      VideIotServer._instance = new VideIotServer();
    }
    return VideIotServer._instance;
  }

  private _client: WXRequestClient = WXRequestClient.getInstance();

  private _appId: string = '';

  private _secretKey: string = '';

  /**
   * RSA 公钥
   */
  private _RSApubkey: string = '';
  /**
   * RSA 私钥
   */
  private _RSApriKey: string = '';
  private _RSAencrypt: JSEncrypt | null = null;

  private _onRequestInterceptor?: typeof WXRequestClient.onRequestInterceptor;

  private _onResponseInterceptor?: typeof WXRequestClient.onResponseInterceptor;
  
  constructor() {

    WXRequestClient.onRequestInterceptor = (request: RequestOptions) => {
      // 正式的
      // const uri = fetchRequest.url.replace(baseUrl, '');
      // 测试
      const splitUrl = request.url.split('/cmiot/');
      const uri = splitUrl.length > 0 ? `/cmiot/${splitUrl[1]}` : splitUrl[0];
      const timestamp = Date.now().toString();

      const wxRequest = request as WechatMiniprogram.RequestOption;
      if (!wxRequest.header) {
        wxRequest.header = {
          'Content-Type': 'application/json; charset=utf-8',
        };
      }
      // 不能使用 JSON.stringify 因为有转译符
      const md5Body = wxRequest.data ? CryptoJS.MD5(JSON.stringify(wxRequest.data)) : '';
      // console.log(`request body`, JSON.stringify(wxRequest.data));
      // console.log(`md5 body`, CryptoJS.MD5(JSON.stringify(wxRequest.data)).toString());
      let urlPath = uri;
      if (request.method === 'GET') {
        urlPath = urlPath.split('?')[0];
      }
      const signatureStr = `${this._secretKey},${this._appId},${timestamp},${urlPath},${md5Body}`;
      console.log(`signatureStr`, signatureStr);
      const signature = CryptoJS.HmacSHA256(signatureStr, this._secretKey).toString(CryptoJS.enc.Base64);
      console.log(`signature`, signature);
      wxRequest.header.appid = this._appId;
      wxRequest.header.msgSeq = Math.random().toString(36).substring(2);
      wxRequest.header.timestamp = timestamp;
      wxRequest.header.signature = signature;

      if (request.method === 'GET') delete request.data;
      return this._onRequestInterceptor ? this._onRequestInterceptor(request) : request;
    };

    WXRequestClient.onResponseInterceptor = (response: APIResponse) => {
      console.log(`onResponseInterceptor`, response);
      return this._onResponseInterceptor ? this._onResponseInterceptor(response) : response;
    };
  }

  init(baseUrl: string, options?: {
    RSApubkey?: string;
    RSApriKey?: string;
    onRequestInterceptor?: typeof WXRequestClient.onRequestInterceptor;
    onResponseInterceptor?: typeof WXRequestClient.onResponseInterceptor;
  }) {
    this._client.init(baseUrl);
    const {
      onRequestInterceptor, onResponseInterceptor,
      RSApubkey, RSApriKey,
    } = options || {};
    onRequestInterceptor && (this._onRequestInterceptor = onRequestInterceptor);
    onResponseInterceptor && (this._onResponseInterceptor = onResponseInterceptor);
    if (RSApubkey || RSApriKey) {
      this._RSApubkey = RSApubkey || "";
      this._RSApriKey = RSApriKey || "";
      this._RSAencrypt = new JSEncrypt();
      // 设置公钥
      if (RSApubkey) {
        this._RSAencrypt.setPublicKey(RSApubkey);
      }
      // 设置私钥
      if (RSApriKey) {
        this._RSAencrypt.setPrivateKey(RSApriKey);
      }
    }
  }

  /**
   * RSA 公钥加密
   */
  /**
   * RSA 私钥解密
   */
  decryptRSAprivatekey(text: string) {
    if (this._RSAencrypt) {
      return this._RSAencrypt.decrypt(text);
    }
    return text;
  }

  login(appId: string, secretKey: string) {
    this._appId = appId;
    this._secretKey = secretKey;
  }

  logout() {
    this._appId = '';
    this._secretKey = '';
  }

  // ============ 设备管理 ============
  /**
   * 设备新增
   * 1-国标28181协议
   * 2-千里眼协议
   * 5-大华私有协议
   */
  addDevice(body: AddDeviceBody) {
    return this._client.post<AddDeviceResponse>('/cmiot/v2/api/device', body);
  }

  /**
   * 设备删除
   */
  deleteDevice(body: DeleteDeviceBody) {
    return this._client.delete(`/cmiot/v2/api/device`, body);
  }

  /**
   * 设备详情查询
   */
  getDeviceInfo(deviceSn: string) {
    return this._client.get<DeviceInfo>(`/cmiot/v2/api/device`, { deviceSn });
  }

  /**
   * 分页获取设备列表
   */
  getDeviceList(body: PaginationBody) {
    return this._client.get<Array<DeviceListItem>>(`/cmiot/v2/api/device/list`, body);
  }

  /**
   * 设备新增
   * 1-国标28181协议
   * 2-千里眼协议
   * 5-大华私有协议
   */
  addDevice1400(body: AddDevice1400Body) {
    return this._client.post<AddDevice1400Response>('/cmiot/v2/api/1400/device', body);
  }

  /**
   * 设备详情查询
   */
  getDevice1400Info(deviceSn: string) {
    return this._client.get<Device1400Info>(`/cmiot/v2/api/1400/device`, { deviceSn });
  }

  /**
   * 获取设备 token
   */
  getDeviceToken(deviceSn: string) {
    return this._client.get<{ deviceToken: string }>(`/cmiot/v2/api/device/token`, { deviceSn });
  }

  /**
   * 获取设备缩略图
   */
  getDeviceThumbnail(body: getDeviceThumbnailBody) {
    return this._client.get<{ deviceSn: string, url: string }>(`/cmiot/v2/api/device/thumbnail`, body);
  }

  /**
   * 查询设备 IP 地址
   */
  getDeviceIP(deviceSn: string) {
    return this._client.get<{ ip: string, port: string }>(`/cmiot/v2/api/device/ip`, { deviceSn });
  }

  /**
   * 查询设备所在节点信息
   */
  getDeviceNodeInfo(deviceSn: string) {
    return this._client.get<Array<DeviceNodeInfo>>(`/cmiot/v2/api/device/dgw/info`, { deviceSn });
  }

  /**
   * 设备添加通道
   */
  createDeviceChannel(body: CreateDeviceChannelBody) {
    return this._client.get<CreateDeviceChannelResponse>(`/cmiot/v2/api/device/channel`, body);
  }

  // 4.1.12\4.1.13\4.1.14

  /**
   * 通道检索
   */
  retrievalDeviceChannel(deviceSn: string) {
    return this._client.post<{ channelList: Array<{ channelId: number, channelName: string }> }>(`/cmiot/v2/api/device/channel/retrieval`, { deviceSn });
  }

  // ============ 设备参数设置 ============

  /**
   * 修改设备名称
   */
  updateDeviceName(body: UpdateDeviceNameBody) {
    return this._client.put(`/cmiot/v2/api/device/info/name`, body);
  }
}
