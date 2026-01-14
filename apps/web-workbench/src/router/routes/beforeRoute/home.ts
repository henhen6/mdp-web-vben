import type { RouteRecordRaw } from 'vue-router';

import { $t } from '@vben/locales';

import { BasicLayout } from '#/layouts';
/**
 * 拼接在后端路由之前的前端路由
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: BasicLayout,
    redirect: '/home/welcome',
    meta: {
      icon: 'bx:bx-home',
      hideInMenu: true,
      component: '_core/home/index',
      title: $t('common.routes.welcome'),
    },
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('#/views/_core/home/index.vue'),
        meta: {
          title: $t('common.routes.welcome'),
          affixTab: true,
          icon: 'bx:bx-home',
        },
      },
    ],
  },
];

export default routes;
