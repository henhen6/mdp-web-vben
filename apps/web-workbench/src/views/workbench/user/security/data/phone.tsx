import type { VbenFormSchema } from '@vben/components/adapter';

import type { SecurityType } from '#/api/workbench/user/security/model';

import { h, reactive } from 'vue';

import { z } from '@vben/common-ui';
import { useVbenForm } from '@vben/components/adapter';
import { useMessage } from '@vben/components/hooks';
import { useUserStore } from '@vben/stores';
import { maskPhone } from '@vben/utils';

import { SecurityApi } from '#/api/workbench/user/security/api';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';

export interface FormState {
  loading: boolean; // 发送验证码按钮是否loading
  btnLoading: boolean; // 提交按钮是否loading
  isFormShow: boolean; // 表单是否显示
}
const CODE_LENGTH = 6;

export function useForm() {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const { createMessage } = useMessage();
  const state = reactive<FormState>({
    loading: false,
    btnLoading: false,
    isFormShow: false,
  });
  const [Form, formApi] = useVbenForm({
    schema: useSchema(userStore, state),
    showDefaultActions: false,
    layout: 'vertical',
    commonConfig: {
      labelWidth: 70,
      colon: true,
    },
  });

  function useSchema(
    userStore: ReturnType<typeof useUserStore>,
    state: FormState,
  ): VbenFormSchema[] {
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
      {
        component: h('div'),
        fieldName: 'phoneTips',
        label: '验证信息',
        renderComponentContent: () => {
          return {
            default: () => {
              return `请补全 ${maskPhone(userStore.userInfo?.phone)} 手机号码并发送验证码`;
            },
          };
        },
      },
      {
        component: 'Input',
        fieldName: 'oldPhone',
        label: '原手机',
        rules: z.string().min(1, { message: $t('authentication.mobileTip') }),
      },
      {
        component: 'Input',
        fieldName: 'phone',
        label: '新手机',
        rules: z
          .string()
          .min(1, { message: $t('authentication.mobileTip') })
          .refine((v) => /^\d{11}$/.test(v), {
            message: $t('authentication.mobileErrortip'),
          }),
      },
      {
        component: 'VbenPinInput',
        fieldName: 'code',
        label: $t('authentication.code'),
        componentProps: {
          codeLength: CODE_LENGTH,
          createText: (countdown: number) => {
            const text =
              countdown > 0
                ? $t('authentication.sendText', [countdown])
                : $t('authentication.sendCode');
            return text;
          },
          handleSendCode: async () => {
            state.loading = true;
            if (!formApi) {
              state.loading = false;
              throw new Error('formApi is not ready');
            }
            await formApi.validateField('phone');
            const isPhoneReady = await formApi.isFieldValid('phone');
            if (!isPhoneReady) {
              state.loading = false;
              throw new Error('请填写手机号');
            }
            const { phone, oldPhone } = await formApi.getValues();
            try {
              const res = await SecurityApi.sendPhoneCode(phone, oldPhone);

              formApi.setFieldValue('key', res || '');
            } catch {
              return false;
            } finally {
              state.loading = false;
            }
            return true;
          },
          placeholder: $t('authentication.code'),
        },
        rules: z.string().length(CODE_LENGTH, {
          message: $t('authentication.codeTip', [CODE_LENGTH]),
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
      const data = await formApi.getValues<SecurityType.ProfilePhoneDto>();

      await SecurityApi.updatePhone(data);
      await authStore.fetchUserInfo();
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
