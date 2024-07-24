import 'miniprogram-api-typings';

/**
 *
 * @export
 * @interface APIResponse
 * @template T
 * @ignore
 */
export interface APIResponse<T = any> {
  resultCode: string;
  resultMsg: string;
  data: T;
}

export type RequestOptions = WechatMiniprogram.RequestOption;
