<script lang="ts" setup>
import type { AppType } from '#/api/open/admin/app/model';

import { onMounted, reactive } from 'vue';

import { useMessage } from '@vben/components/hooks';
import { LOGIN_PATH } from '@vben/constants';
import { isEmptyOrUnDef, isHttpUrl, openWindow } from '@vben/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@vben-core/shadcn-ui';

import { Empty, Tag } from 'ant-design-vue';
import consola from 'consola';

import { AppApi } from '#/api/open/admin/app/api';
import { MyAppApi } from '#/api/workbench/user/app/api';

interface IndexState {
  applicationList: AppType.AppVo[];
}
const state = reactive<IndexState>({
  applicationList: [],
});

onMounted(async () => {
  const list = await AppApi.listMyApp();
  state.applicationList = list;
});

const { createMessage } = useMessage();

/**
 * 跳转应用
 * 1. ssoAutoLoginUrl有值，优先跳转到 ssoAutoLoginUrl
 * 2. 如果 ssoAutoLoginUrl 不是 http 开头，拼接 homeUrl + ssoAutoLoginUrl
 * 3. 如果 homeUrl 也不存在，提示用户配置自动登录地址或首页地址
 * @param item
 */
async function handleGoTo(item: AppType.AppVo) {
  // if (item.ssoAutoLoginUrl) {
  //   if (item.ssoAutoLoginUrl.startsWith('http')) {
  //     if (!isHttpUrl(item.ssoAutoLoginUrl)) {
  //       createMessage.error('[自动登录地址]不是有效的URL');
  //       return;
  //     }
  //     openWindow(item.ssoAutoLoginUrl, { target: '_blank' });
  //     return;
  //   }
  //   if (!isHttpUrl(item.homeUrl)) {
  //     createMessage.error('[首页地址]不是有效的URL');
  //     return;
  //   }
  //   if (item.homeUrl) {
  //     openWindow(item.homeUrl + item.ssoAutoLoginUrl, { target: '_blank' });
  //   } else {
  //     openWindow(item.ssoAutoLoginUrl, { target: '_blank' });
  //   }
  //   return;
  // }
  // if (item.homeUrl) {
  //   if (!isHttpUrl(item.homeUrl)) {
  //     createMessage.error('[首页地址]不是有效的URL');
  //     return;
  //   }

  //   openWindow(item.homeUrl, { target: '_blank' });
  //   return;
  // }
  // if (!item.homeUrl) {
  //   const tip = '该应用未配置[自动登录地址]和[首页地址]，无法跳转';
  //   createMessage.error(tip);
  // }

  const { appKey, ssoAutoLoginUrl, homeUrl } = item;

  if (isEmptyOrUnDef(ssoAutoLoginUrl)) {
    createMessage.error('该应用未配置[自动登录地址]，无法跳转');
    return;
  }
  let autoLoginUrl = ssoAutoLoginUrl;
  if (!ssoAutoLoginUrl.startsWith('http')) {
    autoLoginUrl = homeUrl + ssoAutoLoginUrl;
  }

  if (!isHttpUrl(autoLoginUrl)) {
    createMessage.error(`[自动登录地址] = ${autoLoginUrl}， 不是有效的URL`);
    return;
  }

  const routerHistory =
    import.meta.env.VITE_ROUTER_HISTORY === 'hash' ? '#' : '';

  // 单点登录服务端 登录页地址
  const serverUrl = `${location.origin}${location.origin.endsWith('/') ? '' : '/'}${routerHistory}${LOGIN_PATH}`;

  const res = await MyAppApi.getAutoLoginUrl(
    serverUrl,
    encodeURIComponent(autoLoginUrl),
    appKey,
  );
  consola.log(res);

  openWindow(res, { target: '_blank' });
}
</script>

<template>
  <Card class="m-2">
    <CardHeader class="py-4">
      <CardTitle class="text-lg">我的应用</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-wrap p-0">
      <template
        v-if="state.applicationList && state.applicationList.length > 0"
      >
        <template
          v-for="(item, index) in state.applicationList"
          :key="item.name"
        >
          <div
            :class="{
              // 第2行开始 不要上面
              'border-t-0': index > 2,
              // 第3列 不要右边
              'border-r-0': index % 3 === 2,
              // 最后一行 不要底部
              'border-b-0':
                state.applicationList.length % 3 === 0 ||
                index >= Math.floor(state.applicationList.length / 3) * 3,
              appDisabled: false,
            }"
            class="group w-full cursor-pointer border-y border-r border-border p-4 transition-all hover:shadow-xl md:w-1/2 lg:w-1/3"
            @click.stop.prevent="handleGoTo(item)"
          >
            <div class="flex items-center">
              logo
              <span class="ml-4 text-lg font-medium">{{ item.name }}</span>
            </div>
            <div class="mt-4 flex h-10 text-foreground/80">
              {{ item.intro }}
            </div>
            <div class="mt-4 flex justify-between text-foreground/80">
              <span>
                <Tag color="success"> 正常使用 </Tag>
              </span>
              <span>
                有效期： {{ item.validityStart }} - {{ item.validityEnd }}
              </span>
            </div>
          </div>
        </template>
      </template>
      <div v-else class="w-full border-y border-border">
        <Empty
          class="mx-auto my-5"
          description="暂无可用应用，联系管理员创建应用吧~"
        />
      </div>
    </CardContent>
  </Card>
</template>
<style lang="less">
.appDisabled {
  color: rgb(0 0 0 / 75%);
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 1;
}

.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  .appDisabled {
    color: rgb(255 255 255 / 30%);
    background-color: rgb(255 255 255 / 8%);
  }
}
</style>
