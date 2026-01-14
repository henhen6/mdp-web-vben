import type { RouteRecordRaw } from 'vue-router';

import { mergeRouteModules, traverseTreeValues } from '@vben/utils';

import { coreRoutes, fallbackNotFoundRoute } from './core';

const externalRouteFiles = import.meta.glob('./external/**/*.ts', {
  eager: true,
});
const beforeRouteFiles = import.meta.glob('./beforeRoute/**/*.ts', {
  eager: true,
});
const afterRouteFiles = import.meta.glob('./afterRoute/**/*.ts', {
  eager: true,
});

/** 外部路由列表，访问这些页面可以不需要Layout，可能用于内嵌在别的系统(不会显示在菜单中) */
const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles);

/**
 * 拼接在后端路由之前的前端路由
 */
const beforeRoutes: RouteRecordRaw[] = mergeRouteModules(beforeRouteFiles);
/**
 * 拼接在后端路由之后的前端路由
 */
const afterRoutes: RouteRecordRaw[] = mergeRouteModules(afterRouteFiles);

/** 路由列表，由基本路由、外部路由和404兜底路由组成
 *  无需走权限验证（会一直显示在菜单中） */
const routes: RouteRecordRaw[] = [
  ...coreRoutes,
  ...externalRoutes,
  fallbackNotFoundRoute,
];

/** 基本路由列表，这些路由不需要进入权限拦截 */
const coreRouteNames = traverseTreeValues(coreRoutes, (route) => route.name);

const componentKeys: string[] = Object.keys(
  import.meta.glob('../../views/**/*.vue'),
)
  .filter((item) => !item.includes('/modules/'))
  .map((v) => {
    const path = v.replace('../../views/', '/');
    return path.endsWith('.vue') ? path.slice(0, -4) : path;
  });

export {
  afterRoutes,
  beforeRoutes,
  componentKeys,
  coreRouteNames,
  externalRoutes,
  routes,
};
