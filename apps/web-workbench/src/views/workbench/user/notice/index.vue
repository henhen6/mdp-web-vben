<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { Icon } from '@vben/components/icon';
import { TableAction } from '@vben/components/table-action';

import { Button } from 'ant-design-vue';

import { $t } from '#/locales';

import { useIndex } from './data';

defineOptions({
  name: '站内通知',
  inheritAttrs: false,
});

const { Grid, actions, dropActions } = useIndex();
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <TableAction :actions="actions" :drop-down-actions="dropActions">
          <template v-if="dropActions.length > 0" #more>
            <Button class="ml-2">
              {{ $t('ui.actionTitle.moreOperation') }}
              <Icon icon="ant-design:down-outlined" />
            </Button>
          </template>
        </TableAction>
      </template>
    </Grid>
  </Page>
</template>
