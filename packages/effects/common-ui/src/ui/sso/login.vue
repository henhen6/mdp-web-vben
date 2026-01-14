<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '@vben-core/form-ui';
import type { SegmentedItem } from '@vben-core/shadcn-ui';

import type { LoginProps } from './types';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';

import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from '@vben-core/shadcn-ui';

import Title from '../authentication/auth-title.vue';
import ThirdPartyLogin from '../authentication/third-party-login.vue';
import EmailLogin from './email-login.vue';
import PhoneLogin from './phone-login.vue';
import UsernameLogin from './username-login.vue';

interface Props extends LoginProps {
  // 账号密码 登录表单配置
  usernameFormSchema?: VbenFormSchema[];
  // 手机登录表单配置
  phoneFormSchema?: VbenFormSchema[];
  // 邮箱登录表单配置
  emailFormSchema?: VbenFormSchema[];
}

defineOptions({
  name: 'SsoLogin',
});

withDefaults(defineProps<Props>(), {
  codeLoginPath: '/auth/code-login',
  forgetPasswordPath: '/auth/forget-password',
  usernameFormSchema: () => [],
  phoneFormSchema: () => [],
  emailFormSchema: () => [],
  loading: false,
  qrCodeLoginPath: '/auth/qrcode-login',
  registerPath: '/auth/register',
  showCodeLogin: true,
  showForgetPassword: true,
  showQrcodeLogin: true,
  showRegister: true,
  showRememberMe: true,
  showThirdPartyLogin: false,
  submitButtonText: '',
  subTitle: '',
  title: '',
});

const emit = defineEmits<{
  emailSubmit: [Recordable<any>];
  phoneSubmit: [Recordable<any>];
  usernameSubmit: [Recordable<any>];
}>();

const usernameFormRef = ref();
const phoneFormRef = ref();
const emailFormRef = ref();

const router = useRouter();

function handleGo(path: string) {
  router.push(path);
}

const activeTab = ref('username');

const tabs = computed((): SegmentedItem[] => {
  return [
    {
      label: $t('authentication.accountLogin'),
      value: 'username',
    },
    {
      label: $t('authentication.phoneLogin'),
      value: 'phone',
    },
    {
      label: $t('authentication.emailLogin'),
      value: 'email',
    },
  ];
});

const tabsStyle = computed(() => {
  return {
    'grid-template-columns': `repeat(${tabs.value.length}, minmax(0, 1fr))`,
  };
});

function handleUsernameSubmit(param: any) {
  emit('usernameSubmit', param);
}
function handlePhoneSubmit(param: any) {
  emit('phoneSubmit', param);
}
function handleEmailSubmit(param: any) {
  emit('emailSubmit', param);
}

defineExpose({
  getUsernameFormRef: () => usernameFormRef?.value?.getFormApi(),
  getPhoneFormRef: () => phoneFormRef?.value?.getFormApi(),
  getEmailFormRef: () => emailFormRef?.value?.getFormApi(),
});
</script>

<template>
  <div>
    <slot name="title">
      <Title>
        <slot name="title">
          {{ title || `${$t('authentication.pageTitle')}` }}
        </slot>
      </Title>
    </slot>

    <Tabs v-model="activeTab">
      <TabsList :style="tabsStyle" class="bg-accent relative grid w-full">
        <TabsIndicator
          class="absolute bottom-0 left-0 h-[2px] w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full px-8 transition-[width,transform] duration-300"
        >
          <div class="bg-grass8 h-full w-full"></div>
        </TabsIndicator>
        <template v-for="tab in tabs" :key="tab.value">
          <TabsTrigger
            :value="tab.value"
            class="z-20 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
          >
            {{ tab.label }}
          </TabsTrigger>
        </template>
      </TabsList>

      <TabsContent value="username">
        <UsernameLogin
          ref="usernameFormRef"
          :form-schema="usernameFormSchema"
          :loading="loading"
          @submit="handleUsernameSubmit"
        />
      </TabsContent>
      <TabsContent value="phone">
        <PhoneLogin
          ref="phoneFormRef"
          :form-schema="phoneFormSchema"
          :loading="loading"
          @submit="handlePhoneSubmit"
        />
      </TabsContent>
      <TabsContent value="email">
        <EmailLogin
          ref="emailFormRef"
          :form-schema="emailFormSchema"
          :loading="loading"
          @submit="handleEmailSubmit"
        />
      </TabsContent>
    </Tabs>

    <div
      v-if="showForgetPassword"
      class="mb-2 mt-4 flex items-center justify-between"
    ></div>

    <!-- 第三方登录 -->
    <slot name="third-party-login">
      <ThirdPartyLogin v-if="showThirdPartyLogin" />
    </slot>

    <slot name="to-register">
      <div
        v-if="showForgetPassword"
        class="mb-2 mt-4 flex items-center justify-between"
      >
        <span
          v-if="showForgetPassword"
          class="vben-link text-sm font-normal"
          @click="handleGo(forgetPasswordPath)"
        >
          {{ $t('authentication.forgetPassword') }}
        </span>

        <span v-if="showRegister" class="text-sm font-normal">
          {{ $t('authentication.accountTip') }}
          <span
            class="vben-link text-sm font-normal"
            @click="handleGo(registerPath)"
          >
            {{ $t('authentication.createAccount') }}
          </span>
        </span>
      </div>
    </slot>
  </div>
</template>
