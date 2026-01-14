import type { Ref } from 'vue';

import type { VbenFormSchema } from '@vben/common-ui';

import type { VbenBehaviorCaptcha } from '@vben-core/shadcn-ui';

import type { State } from './login';

import type { useAuthStore } from '#/store';

import { computed, useTemplateRef } from 'vue';

import { z } from '@vben/common-ui';
import { useMessage } from '@vben/components/hooks';
import { MsgTemplateCodeEnum } from '@vben/constants';

import { CaptchaApi } from '#/api/common/captcha';
import { $t } from '#/locales';

import { CODE_LENGTH, handleSuccess } from './login';

export function useEmailLogin(
  state: State,
  formRef: Ref,
  authStore: ReturnType<typeof useAuthStore>,
) {
  const emailVerifyRef =
    useTemplateRef<typeof VbenBehaviorCaptcha>('emailVerifyRef');
  const { createMessage } = useMessage();
  const emailFormSchema = computed((): VbenFormSchema[] => {
    return [
      {
        component: 'VbenInput',
        fieldName: 'key',
        label: ' ',
        dependencies: {
          triggerFields: ['username'],
          show: false,
        },
      },
      {
        component: 'VbenInput',
        componentProps: {
          placeholder: $t('authentication.email'),
        },
        fieldName: 'username',
        label: $t('authentication.email'),
        rules: z
          .string()
          .min(1, { message: $t('authentication.emailTip') })
          .email($t('authentication.emailValidErrorTip')),
      },
      {
        component: 'VbenPinInput',
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
            try {
              const formApi = formRef.value.getEmailFormRef();

              const { valid } = await formApi.validateField('username');

              if (!valid) {
                return false;
              }
              await formApi.getValues();
              emailVerifyRef.value?.instance.refresh();
              emailVerifyRef.value?.show();

              // 因为有行为验证码，这里设置为false
              return false;
            } catch {
              return false;
            }
          },
          placeholder: $t('authentication.code'),
        },
        fieldName: 'code',
        label: $t('authentication.code'),
        rules: z.string().length(CODE_LENGTH, {
          message: $t('authentication.codeTip', [CODE_LENGTH]),
        }),
      },
    ];
  });

  async function handleEmailSubmit(param: any) {
    state.ssoParam.username = param.username;
    state.ssoParam.authType = param.authType;
    state.ssoParam.deviceInfo = param.deviceInfo;
    param.authType = 'EMAIL';
    authStore.authLogin(param, () => handleSuccess(state));
  }

  const sendEmailCode = async (captchaReq: any) => {
    try {
      state.captchaLoading = true;

      const formApi = formRef.value.getEmailFormRef();
      const codeRef = formApi.getFieldComponentRef('code');
      const { username } = await formApi.getValues();
      const key = await CaptchaApi.sendEmailCode(
        username,
        MsgTemplateCodeEnum.EMAIL_LOGIN,
        captchaReq,
      );
      formApi.setFieldValue('key', key);
      codeRef.countdown = 60;
      codeRef.startCountdown();

      state.captchaLoading = false;
      createMessage.success('短信发送成功');
    } catch {
      // resetCaptcha();
    } finally {
      state.captchaLoading = false;
    }
  };

  return {
    emailVerifyRef,
    emailFormSchema,
    handleEmailSubmit,
    sendEmailCode,
  };
}
