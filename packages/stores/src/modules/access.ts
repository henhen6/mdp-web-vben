import type { RouteRecordRaw } from 'vue-router';

import type {
  MenuRecordRaw,
  RouteRecordStringComponent,
} from '@vben-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';

import { pinia } from '../setup';

type AccessToken = null | string;

export interface UserAccessInfoVo {
  // 区分大小写
  caseSensitive: boolean;
  // 是否启用
  enabled: boolean;
  // 拥有的资源编码
  resourceList: string[];
  // 拥有的角色编码
  roleList: string[];
}

interface AccessState {
  /**
   * 解析 routerList 后得到的，用户可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[];
  /**
   * 解析 routerList 后得到的，用户可访问的路由列表
   */
  accessRoutes: RouteRecordRaw[];
  /**
   * 用户的Token
   * 登录后才能得到token
   */
  accessToken: AccessToken;
  /** token 剩余有效时间 */
  expiration: string;
  /**
   * 是否已经检查过 token有效性
   */
  isAccessChecked: boolean;
  /**
   * 是否已经加载了路由
   * 扩展字段
   */
  isLoadRouter: boolean;
  /**
   * 是否锁屏状态
   */
  isLockScreen: boolean;
  /**
   * 是否扮演用户
   * 扩展字段
   */
  isPlayer: boolean;
  /**
   * 锁屏密码
   */
  lockScreenPassword?: string;
  /**
   * 登录是否过期
   */
  loginExpired: boolean;
  /**
   * 登录 accessToken
   */
  refreshToken: AccessToken;
  /**
   * 后端返回的 用户拥有的可用路由列表
   * 扩展字段
   */
  routerList: RouteRecordStringComponent[];
  /**
   * 用户拥有的资源
   * 扩展字段
   */
  userAccessInfo: UserAccessInfoVo;
}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = defineStore('core-access', {
  state: (): AccessState => ({
    accessMenus: [],
    accessRoutes: [],
    accessToken: null,
    expiration: '-1',
    isAccessChecked: false,
    isLoadRouter: false,
    isPlayer: false,
    isLockScreen: false,
    lockScreenPassword: undefined,
    loginExpired: false,
    refreshToken: null,
    routerList: [],
    userAccessInfo: {
      caseSensitive: true,
      enabled: true,
      resourceList: [],
      roleList: [],
    },
  }),
  actions: {
    getMenuByPath(path: string) {
      function findMenu(
        menus: MenuRecordRaw[],
        path: string,
      ): MenuRecordRaw | undefined {
        for (const menu of menus) {
          if (menu.path === path) {
            return menu;
          }
          if (menu.children) {
            const matched = findMenu(menu.children, path);
            if (matched) {
              return matched;
            }
          }
        }
      }
      return findMenu(this.accessMenus, path);
    },
    lockScreen(password: string) {
      this.isLockScreen = true;
      this.lockScreenPassword = password;
    },
    setAccessMenus(menus: MenuRecordRaw[]) {
      this.accessMenus = menus;
    },
    setAccessRoutes(routes: RouteRecordRaw[]) {
      this.accessRoutes = routes;
    },
    setAccessToken(token: AccessToken) {
      this.accessToken = token;
    },
    setExpiration(expiration: string) {
      this.expiration = expiration;
    },
    setIsAccessChecked(isAccessChecked: boolean) {
      this.isAccessChecked = isAccessChecked;
    },
    setIsLoadRouter(isLoadRouter: boolean) {
      this.isLoadRouter = isLoadRouter;
    },
    setLoginExpired(loginExpired: boolean) {
      this.loginExpired = loginExpired;
    },
    setPlayer(isPlayer: boolean) {
      this.isPlayer = isPlayer;
    },
    setRefreshToken(token: AccessToken) {
      this.refreshToken = token;
    },
    unlockScreen() {
      this.isLockScreen = false;
      this.lockScreenPassword = undefined;
    },
    setUserAccessInfo(userAccessInfo: UserAccessInfoVo) {
      this.userAccessInfo = userAccessInfo;
    },
    setRouterList(routerList: RouteRecordStringComponent[]) {
      this.routerList = routerList;
    },
  },
  persist: {
    // 持久化
    pick: [
      'accessToken',
      'refreshToken',
      'userAccessInfo',
      'routerList',
      'isLockScreen',
      'lockScreenPassword',
      'isPlayer',
    ],
  },
});

export const useAccessStoreWithOut = () => {
  return useAccessStore(pinia);
};

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useAccessStore, hot));
}
