<script setup lang="ts">
import { computed } from 'vue';

import { ApiComponent } from '@vben/common-ui';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { Switch } from 'ant-design-vue';

import { createApiFunction, handleAfterFetch } from '../types/tool';

const props = defineProps<{
  api?: (arg?: any) => Promise<any[] | Record<string, any>>;
  checked?: boolean | number | string;
  /** 禁用状态失效 */
  disableInvalid?: boolean;
  // api 参数
  params?: Record<string, any>;
  // api类型
  type?: 'dict' | undefined;
  /** value字段名 */
  valueField?: string;
}>();

const emit = defineEmits<{
  (e: 'update:checked', value: boolean | number | string): void;
}>();

const checked = computed({
  get() {
    return props.checked;
  },
  set(val: boolean | number | string) {
    emit('update:checked', val);
  },
});
defineExpose({
  getValue() {
    return checked.value;
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
    v-model="checked"
    :params="params"
    model-prop-name="checked"
    :component="Switch"
  >
    <template #checkedChildren><CheckOutlined /></template>
    <template #unCheckedChildren><CloseOutlined /></template>
  </ApiComponent>
</template>
<style lang="less" scoped></style>
