/**
 *
 * @export
 * @interface APIResponse
 * @template T
 * @ignore
 */
export interface APIResponse<T> {
  resultCode: string;
  resultMsg: string;
  data: T;
  total?: number;
}

export interface RequestOptions extends RequestInit {
  url: string;
}
