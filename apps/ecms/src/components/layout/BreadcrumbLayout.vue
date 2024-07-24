<!--
 * 面包屑导航
 * @author: web_develop
 * @since: 2024-07-16
 * BreadcrumbLayout.vue
-->
<template>
  <div v-if="breadcrumbList && breadcrumbList.length > 0" class="breadcrumb_custom">
    <el-breadcrumb>
      <el-breadcrumb-item
        v-for="item in breadcrumbList"
        :key="item.name"
        :to="item.path"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  breadcrumbList?: { path?: string; name?: string }[];
}>();
</script>
<style lang="scss" scoped>
.breadcrumb_custom {
  :deep(.el-breadcrumb) {
    .el-breadcrumb__item {
      @apply text-lg;
      .el-breadcrumb__inner {
        @apply text-basic-text;
      }
      .el-breadcrumb__separator {
        @apply font-normal;
      }
    }
    // :last-child {
    //   .el-breadcrumb__inner {
    //     // @apply text-333333 font-semibold;
    //   }
    // }
  }
}
</style>
