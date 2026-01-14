<script setup lang="ts">
import { computed } from 'vue';

import { ApiComponent } from '@vben/common-ui';
import { withCache } from '@vben/stores';

import ApiView from '../api-view.vue';

const props = defineProps<{
  /** 获取options数据的函数 */
  api?: (arg?: any) => Promise<any[] | Record<string, any>>;
  cacheExpireTime?: number;
  childrenField?: string;
  labelField?: string;
  /** 传递给api的参数 */
  params?: (arg?: any) => Record<string, any> | Record<string, any>;
  // 请求方式
  value?: Array<number | string> | null | number | string | undefined;
  valueField?: string;
}>();

const emit = defineEmits<{
  (
    e: 'update:value',
    value: Array<number | string> | null | number | string | undefined,
  ): void;
}>();

// 使用 computed 缓存 withCache 实例
const withCacheApi = computed(() => {
  return withCache(props.api, {
    expireTime: props.cacheExpireTime,
  }) as any;
});

const value = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit('update:value', val);
  },
});
const getParams = computed(() => {
  let newParams = {};
  if (props.params) {
    newParams =
      typeof props.params === 'function'
        ? props.params(value.value)
        : props.params;
  }

  return {
    ...newParams,
  };
});
</script>

<template>
  <ApiComponent
    v-if="value"
    v-model="value"
    model-prop-name="value"
    :api="withCacheApi"
    :params="getParams"
    :component="ApiView"
    :label-field="labelField"
    :value-field="valueField"
    :children-field="childrenField"
  />
</template>
