<script lang="ts" setup>
import type { FormState } from '../data/form';

import { reactive, ref, toRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { ActionEnum } from '@vben/constants';

import { $t } from '#/locales';

import DetailForm from './detail.vue';

const detailRef = ref();
const state = reactive<FormState>({
  type: ActionEnum.ADD,
  formData: {},
});

const [Modal, modalApi] = useVbenModal({
  footer: state.type !== ActionEnum.VIEW,
  async onOpened() {
    state.type = modalApi.getData()?.type;
    state.formData = modalApi.getData()?.formData ?? {};
    detailRef.value.loadFormData(toRaw(state));
  },
  onConfirm() {},
});

defineExpose({ modalApi });
</script>
<template>
  <Modal :title="$t(`common.title.${state.type}`)" class="w-[60%]">
    <DetailForm ref="detailRef" />
  </Modal>
</template>
