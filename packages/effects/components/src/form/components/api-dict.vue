<script setup lang="ts">
import type { Option } from '../types';

import { computed } from 'vue';

import { ApiCheckboxGroup, ApiRadioGroup, ApiSelect, ApiSwitch } from '..';

interface Props {
  // 组件类型
  renderType?: 'CheckboxGroup' | 'RadioGroup' | 'Select' | 'Switch';
  // 字典类型或枚举类型
  type: string;
  // 禁用状态失效
  disableInvalid?: boolean;
  // 数据类型 [1-字符串 2-整型 3-布尔]
  dataType?: '1' | '2' | '3' | undefined;
  // 扩展条目 如：在下拉框里面新增一个选项： 所有
  extend?: Option;
  // 扩展项 位置
  extendIndex?: number;
  // 需要排除的字典条目或枚举条目
  excludes?: string[];
}
const props = withDefaults(defineProps<Props>(), {
  renderType: 'Select',
  params: () => ({}),
  extend: undefined,
  extendIndex: 0,
  excludes: () => [],
  dataType: undefined,
  disableInvalid: false,
});

const DictComponent = computed(() => {
  switch (props.renderType) {
    case 'CheckboxGroup': {
      return ApiCheckboxGroup;
    }
    case 'RadioGroup': {
      return ApiRadioGroup;
    }
    case 'Switch': {
      return ApiSwitch;
    }
    default: {
      return ApiSelect;
    }
  }
});

const getParams = computed(() => {
  return {
    type: props.type,
    extend: props.extend,
    extendIndex: props.extendIndex,
    excludes: props.excludes,
  };
});
</script>
<template>
  <DictComponent
    type="dict"
    value-field="value"
    :disable-invalid="disableInvalid"
    :data-type="dataType"
    :params="getParams"
  />
</template>
