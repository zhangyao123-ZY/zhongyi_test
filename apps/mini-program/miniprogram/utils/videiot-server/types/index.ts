export * from './device';
export * from './message';
/**
 *
 *
 * @export
 * @interface PaginationBody
 */
export interface PaginationBody {
  /**
   * 分页页码
   * 默认1
   */
  page?: number;
  /**
   * 分页大小
   * 默认10 最大100
   */
  pageSize?: number;
}