<script setup lang="ts">
import type { PropType } from 'vue';

import type { DescItem } from './types';

import { VxeText } from '@vben/plugins/vxe-table';

import { Descriptions, DescriptionsItem } from 'ant-design-vue';

import { get } from '../utils/tool';
import { componentMap } from '../view/component-map';

defineProps({
  title: { type: String, default: '' },
  bordered: { type: Boolean, default: true },
  size: {
    type: String as PropType<'default' | 'middle' | 'small'>,
    default: 'small',
  },
  column: {
    type: [Number, Object],
    default: () => {
      // return { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 };
      return 12;
    },
  },
  labelStyle: {
    type: Object,
    default() {
      return {
        width: '10%',
      };
    },
  },
  contentStyle: {
    type: Object,
    default() {
      return {
        width: '40%',
      };
    },
  },
  schema: {
    type: Array as PropType<DescItem[]>,
    default: () => [],
  },
  data: { type: Object, default: undefined },
});
</script>
<template>
  <Descriptions
    :bordered="bordered"
    :column="column"
    :content-style="contentStyle"
    :label-style="labelStyle"
    :size="size"
    :title="title ? title : undefined"
  >
    <template v-for="item in schema" :key="item.field">
      <DescriptionsItem :label="item.label" :span="item.span">
        <component
          :is="(componentMap as Map<String, any>).get(item.component)"
          v-if="(componentMap as Map<String, any>).has(item.component)"
          :value="get(data, item.field)"
          v-bind="{ ...item.componentProps }"
        />
        <component
          :is="item.render(get(data, item.field), data)"
          v-else-if="
            !(componentMap as Map<String, any>).has(item.component) &&
            item.render
          "
          :value="get(data, item.field)"
          v-bind="{ ...item.componentProps }"
        />
        <template v-else>
          <template v-if="item.copy">
            <VxeText
              :content="get(data, item.field)"
              :copy-config="{ status: 'success' }"
              click-to-copy
            />
          </template>
          <template v-else>
            {{ get(data, item.field) }}
          </template>
        </template>
      </DescriptionsItem>
    </template>
  </Descriptions>
</template>
