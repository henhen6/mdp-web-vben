<script setup lang="ts">
import type { CheckboxValueType } from 'ant-design-vue/es/checkbox/interface';

import { computed } from 'vue';

import { ApiComponent } from '@vben/common-ui';

import { CheckboxGroup } from 'ant-design-vue';

import { createApiFunction, handleAfterFetch } from '../types/tool';

const props = defineProps<{
  // 请求接口
  api?: (arg?: any) => Promise<any[] | Record<string, any>>;
  /** 禁用状态失效 */
  disableInvalid?: boolean;
  // api 参数
  params?: Record<string, any>;
  // api类型
  type?: 'dict' | undefined;
  // 当前值
  value?: Array<CheckboxValueType>;
  /** value字段名 */
  valueField?: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: Array<CheckboxValueType> | undefined): void;
}>();

const value = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit('update:value', val);
  },
});

defineExpose({
  getValue() {
    return value.value;
  },
});
</script>
<template>
  <ApiComponent
    :api="createApiFunction(type, disableInvalid, api)"
    :value-field="valueField"
    :after-fetch="
      (res) => handleAfterFetch(res, props.params, props.valueField)
    "
    v-model="value"
    :params="params"
    model-prop-name="value"
    :component="CheckboxGroup"
  />
</template>
<style lang="less" scoped></style>
