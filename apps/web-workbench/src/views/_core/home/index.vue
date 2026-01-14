<script lang="ts" setup>
import type { WorkbenchQuickNavItem } from '@vben/common-ui';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  About,
  WorkbenchHeader,
  WorkbenchQuickNav,
  WorkbenchTrends,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { asyncComputed } from '@vueuse/core';
import { TabPane, Tabs } from 'ant-design-vue';

import { quickNavItems, trendItems } from './schemas/index';

const userStore = useUserStore();

const router = useRouter();

const activeTab = ref('home');

async function handleDemo(nav: WorkbenchQuickNavItem) {
  if (nav.url?.startsWith('http')) {
    openWindow(nav.url);
    return;
  }
  if (nav.url?.startsWith('/')) {
    router.push(nav.url).catch((error) => {
      console.error('Navigation failed:', error);
    });
  } else {
    console.warn(`Unknown URL for navigation item: ${nav.title} -> ${nav.url}`);
  }
}

onMounted(async () => {});

const avatar = asyncComputed(async () => {
  const url = userStore.userInfo?.avatarId ?? preferences.app.defaultAvatar;
  let realSrc = '';
  if (url && url.startsWith('http')) {
    realSrc = url;
  } else if (url && url.startsWith('data:')) {
    realSrc = url;
  } else {
    realSrc = await loadSrc(url);
  }
  return realSrc;
});

async function loadSrc(fileId: string) {
  if (!fileId) {
    return preferences.app.defaultAvatar;
  }
  const api = () => {
    return '';
  };
  const res = await api(fileId);

  return res.code === 0 ? (res.data as string) : preferences.app.defaultAvatar;
}
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader :avatar="avatar">
      <template #title>
        早安, {{ userStore.userInfo?.name }}, 开始您一天的工作吧！
      </template>
      <template #description>
        最后一次登录于： {{ userStore.userInfo?.lastLoginTime }}
      </template>
      <template #tabs>
        <Tabs
          v-model:active-key="activeTab"
          :tab-bar-style="{ marginBottom: 0 }"
        >
          <TabPane key="home" tab="首页" />
          <TabPane key="about" tab="关于项目" />
        </Tabs>
      </template>
    </WorkbenchHeader>

    <div class="mt-5 flex flex-col lg:flex-row" v-show="activeTab === 'home'">
      <div class="mr-4 w-full lg:w-3/5">
        <WorkbenchQuickNav
          :items="quickNavItems"
          title="演示环境"
          @click="handleDemo"
          class="mt-5"
        />
      </div>
      <div class="w-full lg:w-2/5">
        <WorkbenchTrends
          class="mt-5 lg:mt-0"
          :items="trendItems"
          title="最新动态"
        />
      </div>
    </div>
    <div class="mt-5 flex flex-col lg:flex-row" v-show="activeTab === 'about'">
      <About />
    </div>
  </div>
</template>
