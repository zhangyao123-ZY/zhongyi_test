<!--
 * 表格分页布局
 * @author: web_develop
 * @since: 2024-07-15
 * TablePaginationLayout.vue
-->
<template>
  <el-container v-loading="customProps.isLoading" class="bg-white h-full">
    <el-header v-if="slots.header" class="h-auto p-4">
      <slot name="header"></slot>
    </el-header>
    <el-main class="p-4">
      <slot></slot>
    </el-main>
    <el-footer :class="['h-auto px-4', isFooterPadding ? 'pb-4' : '']">
      <!-- 默认分页 -->
      <div
        :class="[
          'flex flex-wrap items-center',
          slots.addFooter ? 'justify-between' : 'justify-end',
        ]"
      >
        <slot name="addFooter"></slot>
        <el-pagination
          v-model:page-size="pageSizePagination"
          v-model:current-page="currentPagePagination"
          background
          :layout="customProps.paginationLayout"
          :total="customProps.paginationTotal"
          :page-sizes="customProps.pageListSizes"
          :pager-count="5"
          :small="customProps.isPaginationSmall"
          @size-change="handleSizeChangeFn"
          @current-change="handleCurrentChangeFn"
        />
      </div>
    </el-footer>
  </el-container>
</template>
<script lang="ts" setup>
const customProps = withDefaults(
  defineProps<{
    isLoading?: boolean;
    // 页脚是否添加内边距
    isFooterPadding?: boolean;

    /** 分页相关 */
    // 分页总数
    paginationTotal?: number;
    // 分页每页显示条目个数
    paginationSize?: number;
    // 分页当前页码
    paginationNum?: number;
    // 分页是否最小化
    isPaginationSmall?: boolean;
    // 插件附加
    paginationLayout?: string;
    // 每页数量可选
    pageListSizes?: number[];
  }>(),
  {
    isFooterPadding: true,
    paginationTotal: 0,
    paginationSize: 10,
    paginationNum: 1,
    paginationLayout: "total, sizes, prev, pager, next, jumper",
    pageListSizes: () => [10, 20, 30, 50],
  }
);
const custonEmits = defineEmits<{
  // 页码改变/分页变更
  (e: "pagination-change", pageNum: number, pagSize: number): void;
}>();

const slots = useSlots();

// 每页显示条目个数
const pageSizePagination = ref(customProps.paginationSize || 10);
watch(
  () => customProps.paginationSize,
  (val) => {
    if (val && pageSizePagination.value !== val) {
      pageSizePagination.value = val;
    }
  }
);
// 每页显示条目个数改变
const handleSizeChangeFn = (val: number) => {
  currentPagePagination.value = 1;
  custonEmits("pagination-change", 1, val);
};

const currentPagePagination = ref(customProps.paginationNum || 1);
watch(
  () => customProps.paginationNum,
  (val) => {
    if (val && currentPagePagination.value !== val) {
      currentPagePagination.value = val;
    }
  }
);
// 页码改变
const handleCurrentChangeFn = (val: number) => {
  custonEmits("pagination-change", val, pageSizePagination.value);
};

// 初始加载
custonEmits(
  "pagination-change",
  currentPagePagination.value,
  pageSizePagination.value
);
</script>
