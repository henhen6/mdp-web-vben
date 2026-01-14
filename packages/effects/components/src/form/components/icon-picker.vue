<script setup lang="ts">
import { ref, watch } from 'vue';

import { IconPicker } from '@vben/common-ui';
import { addCollection } from '@vben/icons';

import AntDesignIcons from '@iconify/json/json/ant-design.json';
import CarbonIcons from '@iconify/json/json/carbon.json';
import { useVModel } from '@vueuse/core';
import { Input, TabPane, Tabs } from 'ant-design-vue';

const props = defineProps({
  value: {
    type: [String],
    default: undefined,
  },
});
const emits = defineEmits(['update:value']);
addCollection(AntDesignIcons);
addCollection(CarbonIcons);
const mValue = useVModel(props, 'value', emits, {
  defaultValue: props.value,
  passive: true,
});

// 根据 value 值确定默认的 activeKey
const activeKey = ref('');
// 初始化 activeKey
const initActiveKey = () => {
  activeKey.value =
    props.value && props.value.startsWith('svg') ? 'svg' : 'ant-design';
};

// 监听 value 变化，更新 activeKey
watch(
  () => props.value,
  () => {
    initActiveKey();
  },
  { immediate: true },
);
const prefixList = ref(['carbon', 'ant-design', 'svg']);
const MInput = Input as any;
</script>
<template>
  <Tabs
    v-model:active-key="activeKey"
    class="icon-picker-tabs w-full"
    type="card"
  >
    <TabPane :key="prefix" :tab="prefix" v-for="prefix in prefixList">
      <IconPicker
        v-bind="$attrs"
        v-model:value="mValue"
        :prefix="prefix"
        model-value-prop="value"
        :input-component="MInput"
        :auto-fetch-api="false"
        class="w-full"
        icon-slot="addonAfter"
      />
    </TabPane>
  </Tabs>
</template>
<style lang="less" scoped>
.icon-picker-tabs {
  :deep(.ant-tabs-nav) {
    margin-bottom: 0;
  }
  :deep(.ant-tabs-tab) {
    padding: 0 12px;
  }
  :deep(.ant-tabs-content-holder) {
    margin-top: 4px;
  }
}
.m-icon-wrap {
  height: 36px;
  cursor: pointer;
}
.m-icon-wrap:hover {
  border: 1px solid blue;
}
.m-icon-wrap-selected {
  height: 36px;
  border: 1px solid blue;
  cursor: pointer;
}
</style>
