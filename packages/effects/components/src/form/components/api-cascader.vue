<script setup lang="ts">
import type { CascaderOptionType } from 'ant-design-vue/es/cascader';

import { computed } from 'vue';

import { ApiComponent } from '@vben/common-ui';

import { Cascader } from 'ant-design-vue';

const props = withDefaults(
  defineProps<{
    api: (arg?: any) => Promise<any[] | Record<string, any>>;

    childrenField?: string;
    labelField?: string;
    value?: Array<CascaderOptionType>;
    valueField?: string;
  }>(),
  {
    valueField: 'id',
    labelField: 'name',
    childrenField: 'children',
    value: () => [],
  },
);

const emit = defineEmits<{
  (e: 'update:value', value: Array<CascaderOptionType>): void;
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
    v-model="value"
    model-prop-name="value"
    :component="Cascader"
    :value-field="valueField"
    :label-field="labelField"
    :children-field="childrenField"
    :api="api"
    class="w-full"
  />
</template>
<style lang="less" scoped></style>
