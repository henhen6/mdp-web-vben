import type { Router } from 'vue-router';

import { LOGIN_PATH, ResultEnum } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

import { afterRoutes, beforeRoutes, coreRouteNames } from '#/router/routes';
import { useAuthStore } from '#/store';

import { generateAccess } from './menuAccess';

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // 页面加载进度条
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

/**
 * 权限访问守卫配置
 *
 * 1. 首次访问时，需要获取 动态路由和动态菜单
 * 2. 白名单路由直接进入
 * 3. 访问登录页时，若已登录，则重定向到 {redirectPath} 或 用户自定义首页 或 首页
 * 4. 判断当前路由是否需要登录
 * 4.1 若不需要登录，无论有无登录，都直接进入
 * 4.2 若需要登录，且未登录（判断token），则跳转到登录页
 * 4.3 若需要登录，且已登录（判断token），则判断是否有访问权限
 *
 * @param router
 */
async function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const authStore = useAuthStore();

    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      if (
        to.path === LOGIN_PATH &&
        accessStore.accessToken &&
        !to.query?.client
      ) {
        return decodeURIComponent(
          (to.query?.redirectPath as string) || preferences.app.defaultHomePath,
        );
      }
      // 若是访问基础路由，直接放行
      return true;
    }

    // 判断当前路由是否需要登录
    if (to.meta.ignoreLogin) {
      return true;
    }

    // 没有token，表示没有登录
    if (!accessStore.accessToken) {
      // 明确声明忽略权限访问，则可以访问
      if (to.meta.ignoreAccess) {
        return true;
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // 如不需要，直接删除 query
          query:
            to.fullPath === preferences.app.defaultHomePath
              ? {}
              : { redirectPath: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        };
      }
      return to;
    }

    // 是否已经验证过token有效性、用户信息、个人拥有的资源信息
    if (accessStore.isAccessChecked) {
      return true;
    }

    try {
      // 1. 获取用户信息，并验证token有效性 2. 获取系统的资源信息
      await Promise.all([authStore.fetchUserInfo(), authStore.fetchResource()]);

      // 3. 生成菜单和路由
      const { accessibleMenus, accessibleRoutes } = await generateAccess({
        router,
        beforeRoutes,
        afterRoutes,
      });

      // 保存菜单信息和路由信息
      accessStore.setAccessMenus(accessibleMenus);
      accessStore.setAccessRoutes(accessibleRoutes);
      accessStore.setIsLoadRouter(true);
    } catch (error: any) {
      if (error?.status === 500) {
        return true;
      }

      if (error?.status === ResultEnum.UNAUTHORIZED) {
        return true;
      }
      // token 无效，也需要重新登录
      return {
        path: LOGIN_PATH,
        // 如不需要，直接删除 query
        query:
          to.fullPath === preferences.app.defaultHomePath
            ? {}
            : { redirectPath: encodeURIComponent(to.fullPath) },
        // 携带当前跳转的页面，登录后重新跳转该页面
        replace: true,
      };
    }

    accessStore.setIsAccessChecked(true);

    const redirectPath = (from.query.redirectPath ??
      (to.path === preferences.app.defaultHomePath
        ? preferences.app.defaultHomePath
        : to.fullPath)) as string;

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    };
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router);
  /** 权限访问 */
  setupAccessGuard(router);
}

export { createRouterGuard };
