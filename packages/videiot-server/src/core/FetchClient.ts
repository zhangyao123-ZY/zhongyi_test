import { APIResponse, RequestOptions } from "./types";

/**
 *
 * @export
 * @class FetchClient
 */
export default class FetchClient {
  private _baseUrl: string = "";

  private _headers?: Headers;

  private static instance: FetchClient;

  static onRequestInterceptor?: (
    request: RequestOptions
  ) => RequestOptions | Promise<RequestOptions>;

  static onResponseInterceptor?: (
    response: Response
  ) => Response | Promise<Response |  APIResponse<any>>;

  constructor() {}

  static getInstance(): FetchClient {
    if (!FetchClient.instance) {
      FetchClient.instance = new FetchClient();
    }
    return FetchClient.instance;
  }

  init(baseUrl: string, headers?: Headers) {
    this._baseUrl = baseUrl;
    headers && (this._headers = headers);
  }

  request(
    method: string,
    route: string,
    data: FormData | { [key: string]: any },
    options: Omit<RequestInit, "body" | "method"> = {}
  ) {
    return new Promise(async (resolve) => {
      let url = this._baseUrl + route;
      const fetchOptions: RequestInit = {
        method,
        ...options,
      };
      if (method != "GET") {
        fetchOptions.body =
          data instanceof FormData ? data : JSON.stringify(data);
      } else {
        const oInfo = encodeURIComponent(JSON.stringify(data));
        url = url + "?jsonObject=" + oInfo;
      }
      this._headers && (fetchOptions.headers = this._headers);
      // 请求拦截器
      const requestOptions = FetchClient.onRequestInterceptor
        ? await FetchClient.onRequestInterceptor({ ...fetchOptions, url })
        : fetchOptions;
      fetch(url, requestOptions).then(async (response) => {
        // 响应拦截器
        const res = FetchClient.onResponseInterceptor
          ? await FetchClient.onResponseInterceptor(response)
          : response;
        resolve(res);
        // if (response.ok) {
        //   const json = await response.json();
        //   resolve(json);
        // } else {
        //   reject(response);
        //   if (response.status === 401) {
        //     // reject(new Error('Unauthorized'));
        //   } else {
        //     reject(new Error('FetchError'));
        //   }
        // }
      });
    });
  }

  async post<T>(
    route: string,
    data: FormData | { [key: string]: any },
    options: Omit<RequestInit, "body" | "method"> = {}
  ): Promise<APIResponse<T>> {
    return this.request("POST", route, data, options) as Promise<
      APIResponse<T>
    >;
  }

  async get<T>(
    route: string,
    data: FormData | { [key: string]: any },
    options: Omit<RequestInit, "body" | "method"> = {}
  ): Promise<APIResponse<T>> {
    return this.request("GET", route, data, options) as Promise<APIResponse<T>>;
  }

  async put<T>(
    route: string,
    data: FormData | { [key: string]: any },
    options: Omit<RequestInit, "body" | "method"> = {}
  ): Promise<APIResponse<T>> {
    return this.request("PUT", route, data, options) as Promise<APIResponse<T>>;
  }

  async delete<T>(
    route: string,
    data: FormData | { [key: string]: any },
    options: Omit<RequestInit, "body" | "method"> = {}
  ): Promise<APIResponse<T>> {
    return this.request("DELETE", route, data, options) as Promise<
      APIResponse<T>
    >;
  }
}
