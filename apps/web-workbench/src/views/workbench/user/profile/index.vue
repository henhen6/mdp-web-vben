<script lang="ts" setup>
import { Button, Card } from 'ant-design-vue';

import { $t } from '#/locales';

import { useForm } from './data/form';

const { Form, isHorizontal, state, handleReset, handleSubmit } = useForm();
</script>
<template>
  <Card title="个人中心" size="small" class="m-2" :loading="state.loading">
    <Form :layout="isHorizontal ? 'horizontal' : 'vertical'" />

    <Button class="ml-[100px]" @click="handleReset">
      {{ $t('common.reset') }}
    </Button>
    <Button
      :loading="state.btnLoading"
      type="primary"
      class="ml-5"
      @click="handleSubmit"
    >
      {{ $t('common.title.update') }}
    </Button>
  </Card>
</template>
