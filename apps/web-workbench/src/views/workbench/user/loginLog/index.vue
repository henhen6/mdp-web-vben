<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { TableAction } from '@vben/components/table-action';

import { useIndex } from './data';
import ExpandContent from './modules/expand-content.vue';
import FormWrapper from './modules/wrapper.vue';

defineOptions({
  name: '登录日志',
  inheritAttrs: false,
});

const { Grid, formWrapperRef, handleRefresh, actions } = useIndex();
</script>
<template>
  <Page auto-content-height>
    <FormWrapper ref="formWrapperRef" @success="handleRefresh" />
    <Grid>
      <template #toolbar-actions>
        <TableAction :actions="actions" />
      </template>
      <template #expand_content="{ row }">
        <ExpandContent :row="row" />
      </template>
    </Grid>
  </Page>
</template>
