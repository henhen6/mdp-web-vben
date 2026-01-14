import type { AuthModel } from '#/api';

import { onMounted, reactive } from 'vue';

import { preferences } from '@vben/preferences';
import { isNullOrUnDef } from '@vben/utils';

import { AuthApi } from '#/api';
import { router } from '#/router';

export const CODE_LENGTH = 6;

export interface State {
  img: string; // 图片验证码
  key: string; // 验证码key
  expireTime?: string; // 过期时间
  loading: boolean; // 验证码加载状态
  captchaLoading: boolean; // 行为验证码加载状态

  ssoParam: AuthModel.GetRedirectUrlDTO;
}

async function ssoAutoLogin(state: State) {
  try {
    if (
      isNullOrUnDef(state.ssoParam.client) ||
      isNullOrUnDef(state.ssoParam.redirect)
    ) {
      return;
    }
    location.href = await AuthApi.getRedirectUrl(state.ssoParam);
  } catch {}
}

export async function handleSuccess(state: State) {
  setTimeout(() => {
    ssoAutoLogin(state);

    if (
      isNullOrUnDef(state.ssoParam.client) ||
      isNullOrUnDef(state.ssoParam.redirect)
    ) {
      router.push(preferences.app.defaultHomePath);
    }
  }, 500);
}

export function useLogin() {
  const route = router.currentRoute.value;
  const state = reactive<State>({
    img: '',
    key: '',
    loading: false,
    captchaLoading: false,

    // SSO 相关参数
    ssoParam: {
      authType: 'CAPTCHA',
      client: route.query.client as string, // 客户端
      redirect: route.query.redirect as string, // 重定向回调地址
      mode: route.query.mode as string, // 模式
    },
  });

  onMounted(() => {
    ssoAutoLogin(state);
  });

  return {
    state,
  };
}
