import type { VbenFormSchema } from '@vben/components/adapter';

import type { SecurityType } from '#/api/workbench/user/security/model';

import { reactive } from 'vue';

import { useVbenForm, z } from '@vben/components/adapter';
import { useMessage } from '@vben/components/hooks';

import { SecurityApi } from '#/api/workbench/user/security/api';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';

export interface State {
  btnLoading: boolean;
  isFormShow: boolean;
}
export function useForm() {
  const authStore = useAuthStore();
  const { createMessage } = useMessage();
  const state = reactive<State>({
    btnLoading: false,
    isFormShow: false,
  });

  const [Form, formApi] = useVbenForm({
    schema: useSchema(),
    layout: 'vertical',
    showDefaultActions: false,
    commonConfig: {
      labelWidth: 80,
      colon: true,
    },
  });

  function useSchema(): VbenFormSchema[] {
    return [
      {
        component: 'Input',
        fieldName: 'oldPassword',
        label: '原密码',
        rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
      },
      {
        component: 'VbenInputPassword',
        fieldName: 'password',
        label: '新密码',
        rules: z
          .string()
          .min(1, { message: $t('authentication.passwordTip') })
          .refine((v) => /^.{6,20}$/.test(v), {
            message: $t('authentication.passwordErrorTip'),
          }),
      },
      {
        component: 'VbenInputPassword',
        fieldName: 'confirmPassword',
        label: '确认密码',
        dependencies: {
          rules(values) {
            const { password } = values;
            return z
              .string({ required_error: $t('authentication.passwordTip') })
              .min(1, { message: $t('authentication.passwordTip') })
              .refine((value) => value === password, {
                message: $t('authentication.confirmPasswordTip'),
              });
          },
          triggerFields: ['password'],
        },
        rules: z
          .string()
          .min(1, { message: $t('authentication.passwordTip') })
          .refine((v) => /^.{6,20}$/.test(v), {
            message: $t('authentication.passwordErrorTip'),
          }),
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
      const data = await formApi.getValues<SecurityType.ProfilePasswordDto>();
      await SecurityApi.updatePassword(data);
      await authStore.fetchUserInfo();
      createMessage.success($t('common.tips.updateSuccess'));
    } finally {
      state.btnLoading = false;
    }
  }

  function handleToggleForm() {
    state.isFormShow = !state.isFormShow;
  }

  return { Form, state, handleToggleForm, handleSubmit };
}
