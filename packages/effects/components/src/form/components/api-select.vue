<script setup lang="ts">
import type { SelectValue } from 'ant-design-vue/es/select';

import { computed, unref, useAttrs } from 'vue';

import { ApiComponent } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Select } from 'ant-design-vue';

import { createApiFunction, handleAfterFetch } from '../types/tool';

const props = withDefaults(
  defineProps<{
    allowClear?: boolean;
    api?: (arg?: any) => Promise<any[] | Record<string, any>>;
    /** 禁用状态失效 */
    disableInvalid?: boolean;
    // api 参数
    params?: Record<string, any>;
    placeholder?: string;
    // 关键字对应的列名
    searchKeys?: string;
    // 显示搜索
    showSearch?: boolean;
    // 传dict不用请求api
    type?: 'dict' | undefined;
    // 选中值
    value?: SelectValue;
    /** value字段名 */
    valueField?: string;
  }>(),
  {
    api: () => {
      return Promise.resolve([]);
    },
    params: {} as any,
    showSearch: undefined,
    allowClear: true,
    placeholder: undefined,
    searchKeys: 'label',
    type: undefined,
    value: undefined,
    valueField: 'value',
  },
);

const emit = defineEmits<{
  (e: 'update:value', value: SelectValue | undefined): void;
}>();
const attrs = useAttrs();

const getPlaceholder = computed(() => {
  return props?.placeholder || $t(`ui.placeholder.select`);
});

const value = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit('update:value', val);
  },
});
const filterOption = (inputValue: string, option: any) => {
  return option[props.searchKeys]
    ?.toLowerCase()
    .includes(inputValue.toLowerCase());
};
const getBindValues = computed(() => {
  const row = {
    ...attrs,
    ...unref(props),
    placeholder: getPlaceholder.value,
    filterOption: props.showSearch === true ? filterOption : undefined,
  };
  return row;
});

defineExpose({
  getValue() {
    return value.value;
  },
});
</script>
<template>
  <ApiComponent
    v-bind="getBindValues"
    :api="createApiFunction(type, disableInvalid, api)"
    v-model="value"
    model-prop-name="value"
    loading-slot="suffixIcon"
    visible-event="onDropdownVisibleChange"
    class="w-full"
    :value-field="valueField"
    :after-fetch="
      (res) => handleAfterFetch(res, props.params, props.valueField)
    "
    :params="params"
    :component="Select"
  />
</template>
<style lang="scss" scoped></style>
