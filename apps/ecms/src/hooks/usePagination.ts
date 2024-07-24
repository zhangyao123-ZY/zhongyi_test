/**
 * 分页
 */

export const usePagination = (options: {
  changeEventFn?: (pageNum?: number, sizeNum?: number) => void;
}) => {
  const { changeEventFn } = options;

  const pageIndex = ref(0);
  const pageTotal = ref(0);
  const pageSize = ref(0);

  const handlePageChangeEventFn = (pageNum: number, sizeNum: number) => {
    pageIndex.value = pageNum;
    pageSize.value = sizeNum;
    changeEventFn && changeEventFn(pageNum, sizeNum);
  };

  return {
    pageIndex,
    pageTotal,
    pageSize,
    handlePageChangeEventFn
  };
};
