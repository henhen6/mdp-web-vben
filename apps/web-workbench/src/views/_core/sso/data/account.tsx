import type { Ref } from 'vue';

import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { State } from './login';

import type { useAuthStore } from '#/store';

import { computed, markRaw, onMounted } from 'vue';

import { SliderCaptcha, z } from '@vben/common-ui';
import { omit } from '@vben/components/utils';

import { CaptchaApi } from '#/api/common/captcha';
import { $t } from '#/locales';

import { handleSuccess } from './login';

async function loadCaptcha(state: State) {
  try {
    state.loading = true;

    const res = await CaptchaApi.getCaptchaImg();

    state.img = res.img;
    state.key = res.key;
    state.expireTime = res.expireTime;
    state.ssoParam.authType = res.enabled ? 'CAPTCHA' : 'USERNAME';
  } catch (error) {
    console.error(error);
  } finally {
    state.loading = false;
  }
}
export function useAccountLogin(
  state: State,
  formRef: Ref,
  authStore: ReturnType<typeof useAuthStore>,
) {
  const usernameFormSchema = computed((): VbenFormSchema[] => {
    return [
      {
        component: 'VbenInput',
        componentProps: {
          placeholder: $t('authentication.usernameTip'),
          autocomplete: 'current-username',
        },
        fieldName: 'username',
        label: $t('authentication.username'),
        rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
      },
      {
        component: 'VbenInputPassword',
        componentProps: {
          placeholder: $t('authentication.password'),
          autocomplete: 'current-password',
        },
        fieldName: 'password',
        label: $t('authentication.password'),
        rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
      },
      {
        component: markRaw(SliderCaptcha),
        fieldName: 'captcha',
        rules: z.boolean().refine((value) => value, {
          message: $t('authentication.verifyRequiredTip'),
        }),
        dependencies: {
          if: () => state.ssoParam.authType === 'USERNAME',
          triggerFields: [''],
        },
      },
      {
        component: 'VbenInputCaptcha',
        componentProps: {
          captcha: state.img,
          class: 'focus:border-primary',
          onCaptchaClick: () => loadCaptcha(state),
          placeholder: $t('authentication.code'),
          loading: state.loading,
        },
        fieldName: 'code',
        label: $t('authentication.code'),
        dependencies: {
          if: () => state.ssoParam.authType === 'CAPTCHA',
          triggerFields: [''],
        },
        rules: z
          .string()
          .min(1, { message: $t('authentication.verifyRequiredTip') }),
      },
    ];
  });

  async function handleAccountLogin(values: Recordable) {
    try {
      const requestParam: any = omit(values, ['code']);
      // 验证码
      if (state.ssoParam.authType === 'CAPTCHA') {
        requestParam.code = values.code;
        requestParam.key = state.key;
        requestParam.authType = state.ssoParam.authType;
      } else {
        state.ssoParam.authType = 'USERNAME';
        requestParam.authType = state.ssoParam.authType;
      }
      state.ssoParam.username = values.username;
      state.ssoParam.deviceInfo = values.deviceInfo;
      await authStore.authLogin(requestParam, () => handleSuccess(state));
    } catch (error: any) {
      console.error(error);
      // 处理验证码错误
      if (error?.response?.data?.code === -12) {
        // 刷新验证码
        formRef.value.getUsernameFormRef()?.setFieldValue('code', '');
        await loadCaptcha(state);
      }
    }
  }

  onMounted(async () => {
    await loadCaptcha(state);
  });

  return {
    state,
    formRef,
    usernameFormSchema,
    handleAccountLogin,
  };
}
