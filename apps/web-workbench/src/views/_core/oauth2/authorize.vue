<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import type { Oauth2Model } from '#/api/common/model/oauth2';

import { computed, markRaw, onMounted, reactive, ref } from 'vue';

import { SliderCaptcha, SsoLogin, z } from '@vben/common-ui';
import { useMessage } from '@vben/components/hooks';
import { MsgTemplateCodeEnum, ResultEnum } from '@vben/constants';
import { $t } from '@vben/locales';

import consola from 'consola';

import { AuthApi } from '#/api';
import { Oauth2Api } from '#/api/common/oauth2';
import { router } from '#/router';
import { useAuthStore } from '#/store';

import ConfirmScope from './confirm-scope.vue';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const formRef = ref();
const confirmScopRef = ref();
const { createMessage } = useMessage();
interface State {
  loginView: boolean;
  confirmView: boolean;
  formParam: FormParam;
  oauth2Param: Oauth2Model.RedirectUriDto;
}
const route = router.currentRoute.value;
interface FormParam {
  phoneKey: string;
  emailKey: string;
}
const state = reactive<State>({
  loginView: false,
  confirmView: false,
  oauth2Param: route.query as unknown as Oauth2Model.RedirectUriDto,
  formParam: {
    phoneKey: 'temp1',
    emailKey: 'temp2',
  },
});
const CODE_LENGTH = 6;

const usernameFormSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
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
    },
  ];
});

const phoneFormSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.mobile'),
      },
      fieldName: 'username',
      label: $t('authentication.mobile'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.mobileTip') })
        .refine((v) => /^\d{11}$/.test(v), {
          message: $t('authentication.mobileErrortip'),
        }),
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
            const formApi = formRef.value.getPhoneFormRef().value.getFormApi();

            const { valid } = await formApi.validateField('username');

            if (!valid) {
              return false;
            }
            const values = await formApi.getValues();
            values.code = '';
            // templateCode 参数需要 提前在消息模板中配置
            state.formParam.phoneKey = await AuthApi.sendPhoneCode(
              values.username,
              MsgTemplateCodeEnum.PHONE_LOGIN,
            );
            return true;
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

const emailFormSchema = computed((): VbenFormSchema[] => {
  return [
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
            const formApi = formRef.value.getEmailFormRef().value.getFormApi();

            const { valid } = await formApi.validateField('username');

            if (!valid) {
              return false;
            }
            const values = await formApi.getValues();
            values.code = '';

            // templateCode 参数需要 提前在消息模板中配置
            state.formParam.emailKey = await AuthApi.sendEmailCode(
              values.username,
              MsgTemplateCodeEnum.EMAIL_LOGIN,
            );
            return true;
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

onMounted(() => {
  oauth2AutoLogin('Oauth2 授权信息检测 ...');
});

async function oauth2AutoLogin(_msg: string) {
  try {
    const res = (await Oauth2Api.getRedirectUri(state.oauth2Param)) as any;

    if (res?.status === 200) {
      const data = res?.data;
      switch (data?.code) {
        case 411: {
          consola.log('请手动确认授权');
          state.loginView = false;
          state.confirmView = true;

          break;
        }
        case (ResultEnum.NOT_TOKEN, ResultEnum.INVALID_TOKEN): {
          consola.log('尚未登录，请先登录');
          state.loginView = true;
          state.confirmView = false;

          break;
        }
        case ResultEnum.SUCCESS: {
          location.href = data?.data;
          break;
        }
        default: {
          createMessage.error(data?.msg);
          break;
        }
      }
    }
  } catch (error: any) {
    consola.log(error);
  }
}
async function handleSuccess() {
  setTimeout(() => {
    oauth2AutoLogin('');
  }, 500);
}
async function handleUsernameSubmit(param: any) {
  authStore.authLogin(param, handleSuccess);
}
async function handlePhoneSubmit(param: any) {
  param.key = state.formParam.phoneKey;
  authStore.authLogin(param, handleSuccess);
}
async function handleEmailSubmit(param: any) {
  param.key = state.formParam.emailKey;
  authStore.authLogin(param, handleSuccess);
}
</script>

<template>
  <div>
    <SsoLogin
      v-if="state.loginView"
      ref="formRef"
      :username-form-schema="usernameFormSchema"
      :phone-form-schema="phoneFormSchema"
      :email-form-schema="emailFormSchema"
      :loading="authStore.loginLoading"
      @phone-submit="handlePhoneSubmit"
      @username-submit="handleUsernameSubmit"
      @email-submit="handleEmailSubmit"
    />
    <ConfirmScope v-if="state.confirmView" ref="confirmScopRef" />
  </div>
</template>
