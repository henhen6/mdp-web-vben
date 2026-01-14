import type { VbenFormSchema } from '@vben/components/adapter';

import { reactive } from 'vue';

import { useVbenForm } from '@vben/components/adapter';
import { useMessage } from '@vben/components/hooks';
import { useUserStore } from '@vben/stores';

import { $t } from '#/locales';

export interface FormState {
  loading: boolean; // 发送验证码按钮是否loading
  btnLoading: boolean; // 提交按钮是否loading
  isFormShow: boolean; // 表单是否显示
}

export function useForm() {
  const userStore = useUserStore();
  const { createMessage } = useMessage();
  const state = reactive<FormState>({
    loading: false,
    btnLoading: false,
    isFormShow: false,
  });
  const [Form, formApi] = useVbenForm({
    schema: useSchema(),
    showDefaultActions: false,
    layout: 'vertical',
    commonConfig: {
      labelWidth: 70,
      colon: true,
    },
  });

  function useSchema(): VbenFormSchema[] {
    return [
      {
        component: 'Input',
        fieldName: 'key',
        label: 'userId',
        dependencies: {
          show: false,
          triggerFields: ['phoneTips'],
        },
      },
    ];
  }

  async function handleSubmit() {
    try {
      if (state.btnLoading) {
        return;
      }
      state.btnLoading = true;
      const { valid } = await formApi.validate();
      if (!valid) {
        return;
      }
      // const data = await formApi.getValues<SecurityType.ProfilePhoneDto>();

      createMessage.success($t('common.tips.updateSuccess'));
    } finally {
      state.btnLoading = false;
    }
  }
  function handleToggleForm() {
    state.isFormShow = !state.isFormShow;
  }
  return {
    Form,
    state,
    userStore,
    handleSubmit,
    handleToggleForm,
  };
}
