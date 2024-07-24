import { URLSearchParams } from "../../util";
import { APIResponse, RequestOptions } from "./types";

/**
 *
 * @export
 * @class FetchClient
 */
export default class WXRequestClient {

  private _baseUrl: string = '';

  private _headers?: WechatMiniprogram.RequestOption['header'];

  private static instance: WXRequestClient;

  static onRequestInterceptor?: (request: RequestOptions) => RequestOptions | Promise<RequestOptions>;

  static onResponseInterceptor?: <T>(response: APIResponse<T>) => APIResponse<T> | Promise<APIResponse<T>>;

  constructor() {}

  static getInstance(): WXRequestClient {
    if (!WXRequestClient.instance) {
      WXRequestClient.instance = new WXRequestClient();
    }
    return WXRequestClient.instance;
  }

  init(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  request<T>(
    method: WechatMiniprogram.RequestOption['method'],
    route: string,
    data: WechatMiniprogram.RequestOption['data'],
    options: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'> = {}
) {
    return new Promise(async (resolve, reject) => {
      const url = this._baseUrl + route;
      const fetchOptions: WechatMiniprogram.RequestOption = {
        method: method as WechatMiniprogram.RequestOption['method'],
        ...(options as WechatMiniprogram.RequestOption),
        url,
        data
      };
      // 请求拦截器
      const requestOptions = WXRequestClient.onRequestInterceptor ?
        await WXRequestClient.onRequestInterceptor(fetchOptions) :
        fetchOptions;
      wx.request({
        ...requestOptions,
        success: (res: WechatMiniprogram.RequestSuccessCallbackResult) => {
          if (WXRequestClient.onResponseInterceptor) {
            const maybePromise = WXRequestClient.onResponseInterceptor<T>(res.data as APIResponse<T>);
            maybePromise instanceof Promise ?
              maybePromise.then(res => resolve(res)) :
              resolve(maybePromise);
          } else {
            resolve(res.data);
          }
        },
        fail: (err: WechatMiniprogram.RequestFailCallbackErr) => {
          reject(err.errno);
        }
      });
    });
  }

  async post<T>(
    route: string,
    data: WechatMiniprogram.RequestOption['data'],
    options: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'> = {}
  ): Promise<APIResponse<T>> {
    return this.request('POST', route, data, options) as Promise<APIResponse<T>>;
  }

  async get<T>(
    route: string,
    data: Record<string, any>,
    options: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'> = {}
  ): Promise<APIResponse<T>> {

    const typeOf = (value: any) => {
      const strType = Object.prototype.toString.call(value);
      return strType.substring(8, strType.length - 1).toLocaleLowerCase();
    };
    const urlParams: Record<string, any> = {};
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (typeOf(value) === 'object' || typeOf(value) === 'array') {
        urlParams[key] = encodeURIComponent(JSON.stringify(value));
      } else {
        urlParams[key] = encodeURIComponent(value);
      }
    });
    if (!urlParams.jsonObject) {
      console.log(`JSON.stringify(data)`, JSON.stringify(data));
      console.log(`encodeURIComponent JSON.stringify(data)`, encodeURIComponent(JSON.stringify(data)));
      urlParams.jsonObject = encodeURIComponent(JSON.stringify(data));
    }
    const queryString = new URLSearchParams(urlParams);
    return this.request('GET', route + '?' + queryString, data, options) as Promise<APIResponse<T>>;
  }

  async put<T>(
    route: string,
    data: WechatMiniprogram.RequestOption['data'],
    options: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'> = {}
  ): Promise<APIResponse<T>> {
    return this.request('PUT', route, data, options) as Promise<APIResponse<T>>;
  }

  async delete<T>(
    route: string,
    data: WechatMiniprogram.RequestOption['data'],
    options: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'> = {}
  ): Promise<APIResponse<T>> {
    return this.request('DELETE', route, data, options) as Promise<APIResponse<T>>;
  }

}
