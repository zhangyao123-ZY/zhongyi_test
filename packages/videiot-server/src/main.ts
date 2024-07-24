import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

import FetchClient from "./core/FetchClient";
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
  getDeviceThumbnailBody,
} from "./types";
import { APIResponse, RequestOptions } from "./core/types";
import { MessageTypeEnum } from "./types/message/info";
import { IMessageSubscribeRequest } from "./types/message/api";

export default class VideIotServer {
  private static _instance: VideIotServer;

  static getInstance(): VideIotServer {
    if (!VideIotServer._instance) {
      VideIotServer._instance = new VideIotServer();
    }
    return VideIotServer._instance;
  }

  private _client: FetchClient = FetchClient.getInstance();

  private _appId: string = "";

  private _secretKey: string = "";

  /**
   * RSA 公钥
   */
  private _RSApubkey: string = "";
  /**
   * RSA 私钥
   */
  private _RSApriKey: string = "";
  private _RSAencrypt: JSEncrypt | null = null;

  private _onRequestInterceptor?: typeof FetchClient.onRequestInterceptor;

  private _onResponseInterceptor?: typeof FetchClient.onResponseInterceptor;

  constructor() {
    FetchClient.onRequestInterceptor = (request: RequestOptions) => {
      if (!request.headers) {
        request.headers = new Headers({
          "Content-Type": "application/json; charset=utf-8",
        });
      }
      // 添加鉴权头
      if (request.headers instanceof Headers) {
        // 正式的
        // const uri = request.url.replace(baseUrl, '');
        let uri = request.url.replace(
          `${location.protocol}//${location.host}/api`,
          ""
        );
        const timestamp = Date.now().toString();

        let md5Body = "";

        if (request.method === "GET") {
          // 以？分割，获取url后面的参数和前边的参数
          const oM = uri.split("?");
          uri = oM[0];
          // get 请求的参数
          const oParams = oM[1];
          const oIndex = oParams.indexOf("=");
          if (oParams && oIndex != -1) {
            const oStr = oParams.substring(oIndex + 1);
            const oStr2 = decodeURIComponent(oStr);
            md5Body = CryptoJS.MD5(oStr2).toString();
          }
        } else {
          md5Body = request.body
            ? CryptoJS.MD5(request.body.toString()).toString()
            : "";
        }
        const signatureStr = `${this._secretKey},${this._appId},${timestamp},${uri},${md5Body}`;
        const signature = CryptoJS.HmacSHA256(
          signatureStr,
          this._secretKey
        ).toString(CryptoJS.enc.Base64);
        request.headers.append("appid", this._appId);
        request.headers.append(
          "msgSeq",
          Math.random().toString(36).substring(2)
        );
        request.headers.append("timestamp", timestamp);
        request.headers.append("signature", signature);
      }
      return this._onRequestInterceptor
        ? this._onRequestInterceptor(request)
        : request;
    };

    FetchClient.onResponseInterceptor = (response: Response) => {
      // console.log(`onResponseInterceptor`, response);
      return this._onResponseInterceptor
        ? this._onResponseInterceptor(response)
        : response;
    };
  }

  init(
    baseUrl: string,
    options?: {
      RSApubkey?: string;
      RSApriKey?: string;

      onRequestInterceptor?: typeof FetchClient.onRequestInterceptor;
      onResponseInterceptor?: typeof FetchClient.onResponseInterceptor;
    }
  ) {
    this._client.init(baseUrl);

    const {
      onRequestInterceptor,
      onResponseInterceptor,
      RSApubkey,
      RSApriKey,
    } = options || {};
    onRequestInterceptor && (this._onRequestInterceptor = onRequestInterceptor);
    onResponseInterceptor &&
      (this._onResponseInterceptor = onResponseInterceptor);
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
    this._appId = "";
    this._secretKey = "";
  }

  // ============ 设备管理 ============
  /**
   * 设备新增
   * 1-国标28181协议
   * 2-千里眼协议
   * 5-大华私有协议
   */
  addDevice(body: AddDeviceBody) {
    return this._client.post<AddDeviceResponse>("/cmiot/v2/api/device", body);
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
    return this._client.get<Array<DeviceListItem>>(
      `/cmiot/v2/api/device/list`,
      body
    );
  }

  /**
   * 设备新增
   * 1-国标28181协议
   * 2-千里眼协议
   * 5-大华私有协议
   */
  addDevice1400(body: AddDevice1400Body) {
    return this._client.post<AddDevice1400Response>(
      "/cmiot/v2/api/1400/device",
      body
    );
  }

  /**
   * 查询 1400 设备接入信息
   */
  getDevice1400Info(gaChannelCode: string) {
    return this._client.get<Device1400Info>(`/cmiot/v2/api/1400/info`, {
      gaChannelCode,
    });
  }

  /**
   * 获取设备 token
   */
  getDeviceToken(deviceSn: string) {
    return this._client.get<{ deviceToken: string }>(
      `/cmiot/v2/api/device/token`,
      { deviceSn }
    );
  }

  /**
   * 获取设备缩略图
   */
  getDeviceThumbnail(body: getDeviceThumbnailBody) {
    return this._client.get<{ deviceSn: string; url: string }>(
      `/cmiot/v2/api/device/thumbnail`,
      body
    );
  }

  /**
   * 查询设备 IP 地址
   */
  getDeviceIP(deviceSn: string) {
    return this._client.get<{ ip: string; port: string }>(
      `/cmiot/v2/api/device/ip`,
      { deviceSn }
    );
  }

  /**
   * 查询设备所在节点信息
   */
  getDeviceNodeInfo(deviceSn: string) {
    return this._client.get<Array<DeviceNodeInfo>>(
      `/cmiot/v2/api/device/dgw/info`,
      { deviceSn }
    );
  }

  /**
   * 设备添加通道
   */
  createDeviceChannel(body: CreateDeviceChannelBody) {
    return this._client.post<CreateDeviceChannelResponse>(
      `/cmiot/v2/api/device/channel`,
      body
    );
  }

  // 4.1.12\4.1.13\4.1.14

  /**
   * 通道检索
   */
  retrievalDeviceChannel(deviceSn: string) {
    return this._client.post<{
      channelList: Array<{ channelId: number; channelName: string }>;
    }>(`/cmiot/v2/api/device/channel/retrieval`, { deviceSn });
  }

  // ============ 设备参数设置 ============

  /**
   * 修改设备名称
   */
  updateDeviceName(body: UpdateDeviceNameBody) {
    return this._client.put(`/cmiot/v2/api/device/info/name`, body);
  }

  // ============ 消息订阅 ============
  /**
   * 订阅消息
   */
  messageSubscribe(body: IMessageSubscribeRequest) {
    return this._client.post(`/cmiot/v2/api/msg/subscribe`, body);
  }
  /**
   * 取消订阅消息
   */
  messageUnsubscribe(type: MessageTypeEnum) {
    return this._client.post(`/cmiot/v2/api/msg/unsubscribe`, {type});
  }
}
