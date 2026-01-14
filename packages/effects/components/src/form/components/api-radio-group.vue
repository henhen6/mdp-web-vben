<script setup lang="ts">
import type { SelectValue } from 'ant-design-vue/es/select';

import { computed } from 'vue';

import { ApiComponent } from '@vben/common-ui';

import { RadioGroup } from 'ant-design-vue';

import { createApiFunction, handleAfterFetch } from '../types/tool';

const props = defineProps<{
  api?: (arg?: any) => Promise<any[] | Record<string, any>>;
  /** 禁用状态失效 */
  disableInvalid?: boolean;
  // 是否按钮
  isBtn?: boolean;
  // api 参数
  params?: Record<string, any>;
  // api类型
  type?: 'dict' | undefined;
  value?: SelectValue;
  /** value字段名 */
  valueField?: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: SelectValue): void;
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
    :button-style="isBtn ? 'solid' : 'outline'"
    :option-type="isBtn ? 'button' : 'default'"
    v-model="value"
    :params="params"
    model-prop-name="value"
    :component="RadioGroup"
  />
</template>
<style lang="less" scoped></style>
