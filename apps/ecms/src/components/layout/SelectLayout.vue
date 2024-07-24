<!--
 * new page
 * @author: web_develop
 * @since: 2024-07-16
 * SelectLayout.vue
-->
<template>
  <el-select v-bind="$attrs" size="large" class="w-full select_custom">
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>
    <el-option
      v-for="item in selectOptionLayout"
      :key="item[configAttributes.value]"
      :label="item[configAttributes.label]"
      :value="item[configAttributes.value]"
    />
  </el-select>
</template>
<script lang="ts" setup>
interface SelectOptionInterface {
  label?: string;
  value?: string | number | any;
}

interface SelectOptionListInterface extends SelectOptionInterface {
  [key: string]: string | number | any;
}

const customProps = withDefaults(
  defineProps<{
    selectOption: SelectOptionInterface[];
    configAttributes?: {
      label: string;
      value: string;
    };
  }>(),
  {
    configAttributes: () => ({
      label: "label",
      value: "value",
    }),
  }
);
const slots = useSlots();

const selectOptionLayout = computed(() => {
  return customProps.selectOption as SelectOptionListInterface[];
});
</script>
