<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '@vben-core/form-ui';

import type { FormProps } from './types';

import { computed, onMounted, reactive, ref } from 'vue';

import { useVbenForm } from '@vben-core/form-ui';
import { VbenButton, VbenCheckbox } from '@vben-core/shadcn-ui';

defineOptions({
  name: 'EmailLogin',
});

const props = withDefaults(defineProps<Props>(), {
  formSchema: () => [],
  loading: false,
  showRememberMe: true,
  submitButtonText: '',
});

const emit = defineEmits<{
  submit: [Recordable<any>];
}>();

interface Props extends FormProps {
  formSchema?: VbenFormSchema[];
}

const REMEMBER_ME_KEY = `REMEMBER_ME_EMAIL_${location.hostname}`;

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';
const rememberMe = ref(!!localUsername);

onMounted(() => {
  if (localUsername) {
    formApi.setFieldValue('username', localUsername);
  }
});

const [Form, formApi] = useVbenForm(
  reactive({
    commonConfig: {
      hideLabel: true,
      hideRequiredMark: true,
    },
    schema: computed(() => props.formSchema),
    showDefaultActions: false,
  }),
);

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (valid) {
    localStorage.setItem(
      REMEMBER_ME_KEY,
      rememberMe.value ? values?.username : '',
    );
    const param = {
      ...values,
    };
    emit('submit', param);
  }
}

defineExpose({
  getFormApi: () => formApi,
});
</script>
<template>
  <div @keydown.enter.prevent="handleSubmit">
    <Form />

    <div v-if="showRememberMe" class="mb-6 flex justify-between">
      <div class="flex-center">
        <VbenCheckbox
          v-if="showRememberMe"
          v-model:checked="rememberMe"
          name="rememberMe"
        >
          {{ $t('authentication.rememberMe') }}
        </VbenCheckbox>
      </div>
    </div>
    <VbenButton
      :class="{
        'cursor-wait': loading,
      }"
      :loading="loading"
      aria-label="login"
      class="w-full"
      @click="handleSubmit"
    >
      {{ submitButtonText || $t('common.login') }}
    </VbenButton>
  </div>
</template>
