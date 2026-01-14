<script lang="ts" setup>
import { computed } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Card, Divider, Space } from 'ant-design-vue';

import { contentStyle, useDetail } from '../data/view';
import Preview from './preview.vue';

defineOptions({
  name: '查看站内通知',
  inheritAttrs: false,
});
const { state, loadFormData } = useDetail();
const content = computed(() => state.formData?.content);
defineExpose({
  loadFormData,
});
</script>
<template>
  <Page>
    <template #title> 查看通知 </template>
    <Card size="small" :body-style="contentStyle" class="card_detail">
      <div class="detail_content">
        <h1 class="title">{{ state.formData?.title }}</h1>
        <div class="info">
          <Space>
            <span class="inline-flex items-center">
              <IconifyIcon
                icon="ant-design:user-outlined"
                class="mr-1 align-middle"
              />
              <span class="label align-middle"> 发布人： </span>
              <span class="align-middle">{{ state.formData?.author }}</span>
            </span>
            <Divider direction="vertical" />
            <span class="inline-flex items-center">
              <IconifyIcon
                icon="ant-design:field-time"
                class="mr-1 align-middle"
              />
              <span class="label align-middle">发布时间：</span>
              <span class="align-middle">{{ state.formData?.createdAt }}</span>
            </span>
          </Space>
        </div>
        <div style="flex: 1">
          <Preview v-model:model-value="content" />
        </div>
      </div>
    </Card>
  </Page>
</template>
<style scoped lang="less">
.card_detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.detail_content {
  position: relative;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  .title {
    text-align: center;
    font-size: 2em;
    font-weight: bold;
  }

  .info {
    text-align: center;
  }
}
</style>
