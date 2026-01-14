<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    displaySeparator?: string;
    options?: Array<any>;
    separator?: string;
    value?: Array<number | string> | null | number | string | undefined;
  }>(),
  {
    separator: ',',
    displaySeparator: ', ',
    value: undefined,
    options: () => [],
  },
);

// 递归查找选项（支持树形结构）
const findOption = (
  value: number | string,
  options: any[],
): any | undefined => {
  for (const option of options) {
    if (option.value === value) {
      return option;
    }
    if (option.children && option.children.length > 0) {
      const found = findOption(value, option.children);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

const displayValue = computed(() => {
  // 如果没有选项或值为空，直接返回值
  if (
    !props.options ||
    props.options.length === 0 ||
    props.value === undefined ||
    props.value === null
  ) {
    return props.value;
  }
  let values = props.value;
  if (typeof values === 'string' && values.includes(props.separator)) {
    values = values.split(props.separator);
  }
  // 处理数组值（多选情况）
  if (Array.isArray(values)) {
    const labels = values.map((val) => {
      const option = findOption(val, props.options!);
      return option ? option.label : val;
    });
    return labels.join(props.displaySeparator);
  }

  // 处理单个值
  const option = findOption(values, props.options);
  return option ? option.label : props.value;
});
</script>
<template>
  <span>{{ displayValue }}</span>
</template>
<style lang="scss" scoped></style>
