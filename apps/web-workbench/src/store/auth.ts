import type { UserInfo } from '@vben/types';

import type { AuthModel } from '#/api';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useMessage } from '@vben/components/hooks';
import { LOGIN_PATH } from '@vben/constants';
import { useDeviceInfo } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { AuthApi, UserApi } from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();
  const { createConfirm } = useMessage();
  const { deviceInfo } = useDeviceInfo();
  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: AuthModel.LoginDTO,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;

      params.deviceInfo = `${JSON.stringify(deviceInfo.value)}`;
      params.deviceId = deviceInfo.value?.deviceId;

      const { tokenValue, refreshToken, expire } = await AuthApi.login(params);

      // 如果成功获取到 accessToken
      if (tokenValue) {
        accessStore.setAccessToken(tokenValue);
        accessStore.setRefreshToken(refreshToken);
        accessStore.setExpiration(expire);

        // 获取用户信息并存储到 accessStore 中
        userInfo = await UserApi.getUserinfo();
        userStore.setUserInfo(userInfo);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.name) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.name}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await AuthApi.logout();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    createConfirm({
      iconType: 'success',
      content: '退出成功',
      okText: '关闭',
      cancelText: `重新登录`,
      onCancel: async () => {
        await router.replace({
          path: LOGIN_PATH,
          query: redirect
            ? {
                redirectPath: encodeURIComponent(
                  router.currentRoute.value.fullPath,
                ),
              }
            : {},
        });
      },
      onOk: async () => {
        window.opener = null;
        window.open('about:blank', '_self')?.close();
      },
    });
  }

  async function signout(redirect: boolean = true) {
    try {
      await AuthApi.signout(import.meta.env.VITE_GLOB_APP_KEY);
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    createConfirm({
      iconType: 'success',
      content: '注销成功',
      okText: '关闭',
      cancelText: `重新登录`,
      onCancel: async () => {
        await router.replace({
          path: LOGIN_PATH,
          query: redirect
            ? {
                redirectPath: encodeURIComponent(
                  router.currentRoute.value.fullPath,
                ),
              }
            : {},
        });
      },
      onOk: async () => {
        window.opener = null;
        window.open('about:blank', '_self')?.close();
      },
    });
  }

  async function fetchUserInfo() {
    const userInfo: null | UserInfo = await UserApi.getUserinfo();
    userStore.setUserInfo(userInfo);
    accessStore.setPlayer(userInfo.isPlayer || false);
    return userInfo;
  }

  async function fetchResource() {
    const resource = await UserApi.findUserResource(
      import.meta.env.VITE_GLOB_APP_ID,
    );
    accessStore.setUserAccessInfo(resource);
    return resource;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchResource,
    fetchUserInfo,
    loginLoading,
    logout,
    signout,
  };
});
