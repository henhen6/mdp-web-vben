<script lang="ts" setup>
import { useTemplateRef } from 'vue';

import { SsoLogin } from '@vben/common-ui';

import { VbenBehaviorCaptcha } from '@vben-core/shadcn-ui';

import { CaptchaApi } from '#/api/common/captcha';
import { useAuthStore } from '#/store';

import { useAccountLogin } from './data/account';
import { useEmailLogin } from './data/email';
import { useLogin } from './data/login';
import { usePhoneLogin } from './data/phone';

defineOptions({ name: 'SsoLogin' });

const authStore = useAuthStore();
const formRef = useTemplateRef('formRef');

const { state } = useLogin();

const { phoneVerifyRef, phoneFormSchema, handlePhoneSubmit, sendPhoneCode } =
  usePhoneLogin(state, formRef, authStore);
const { emailVerifyRef, emailFormSchema, handleEmailSubmit, sendEmailCode } =
  useEmailLogin(state, formRef, authStore);
const { usernameFormSchema, handleAccountLogin } = useAccountLogin(
  state,
  formRef,
  authStore,
);
</script>

<template>
  <div>
    <SsoLogin
      ref="formRef"
      :username-form-schema="usernameFormSchema"
      :phone-form-schema="phoneFormSchema"
      :email-form-schema="emailFormSchema"
      :loading="authStore.loginLoading"
      @phone-submit="handlePhoneSubmit"
      @username-submit="handleAccountLogin"
      @email-submit="handleEmailSubmit"
    />
    <VbenBehaviorCaptcha
      ref="phoneVerifyRef"
      captcha-type="blockPuzzle"
      mode="pop"
      :get-behavior-captcha="CaptchaApi.getBehaviorCaptcha"
      :check-behavior-captcha="CaptchaApi.checkBehaviorCaptcha"
      :img-size="{ width: '330px', height: '155px' }"
      @success="sendPhoneCode"
    />
    <VbenBehaviorCaptcha
      ref="emailVerifyRef"
      captcha-type="blockPuzzle"
      mode="pop"
      :get-behavior-captcha="CaptchaApi.getBehaviorCaptcha"
      :check-behavior-captcha="CaptchaApi.checkBehaviorCaptcha"
      :img-size="{ width: '330px', height: '155px' }"
      @success="sendEmailCode"
    />
  </div>
</template>
