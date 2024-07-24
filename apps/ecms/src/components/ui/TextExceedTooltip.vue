<!--
 * 文字超出显示省略号并进行 tooltip 提示
 * @author: web_develop
 * @since: 2024-06-04
 * TextExceedTooltip.vue
-->
<template>
  <div ref="remarkParentRef" class="flex-1 overflow-hidden">
    <el-tooltip
      popper-class="tooltip_max_custom"
      :placement="customProps.placement"
      :content="customProps.content"
      :disabled="isTooltipDisabled"
    >
      <div class="truncate" @mouseover="tooltipMouseOverFn">
        <span ref="remarkRef">
          <slot>{{ customProps.content }}</slot>
        </span>
      </div>
    </el-tooltip>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";

const customProps = withDefaults(
  defineProps<{
    // 文字内容
    content: string;

    // 显示方向
    placement?:
      | "top"
      | "top-start"
      | "top-end"
      | "bottom"
      | "bottom-start"
      | "bottom-end"
      | "left"
      | "left-start"
      | "left-end"
      | "right"
      | "right-start"
      | "right-end";
  }>(),
  {
    placement: "top",
  }
);

const remarkRef = ref<HTMLElement>();
const remarkParentRef = ref<HTMLElement>();
const textWidth = computed(() => {
  return remarkRef.value?.offsetWidth || 40;
});
const parentWidth = computed(() => {
  return remarkParentRef.value?.offsetWidth || 50;
});

// tooltip 是否可用
const isTooltipDisabled = ref(true);

const tooltipMouseOverFn = () => {
  isTooltipDisabled.value = textWidth.value <= parentWidth.value;
};
</script>
