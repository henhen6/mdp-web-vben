import type { AxiosRequestConfig } from '@vben/request';
import type { UserAccessInfoVo } from '@vben/stores';
import type { RouteRecordStringComponent, UserInfo } from '@vben/types';

import type { UserModel } from '#/api';

import { ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

export const UserConfig = {
  UpdateBaseInfo: {
    url: `${ServicePrefixEnum.WORKBENCH}/anyone/baseInfo`,
    method: 'PUT',
  } as AxiosRequestConfig,
  UpdateAvatar: {
    url: `${ServicePrefixEnum.WORKBENCH}/anyone/avatar`,
    method: 'PUT',
  } as AxiosRequestConfig,
  UpdatePassword: {
    url: `${ServicePrefixEnum.WORKBENCH}/anyone/password`,
    method: 'PUT',
  } as AxiosRequestConfig,
  UpdateEmail: {
    url: `${ServicePrefixEnum.WORKBENCH}/anyone/email`,
    method: 'PUT',
  } as AxiosRequestConfig,
  UpdateMobile: {
    url: `${ServicePrefixEnum.WORKBENCH}/anyone/mobile`,
    method: 'PUT',
  } as AxiosRequestConfig,
};

export namespace UserApi {
  /**
   * 获取用户拥有的资源
   */
  export async function findUserResource(appId: string) {
    return requestClient.get<UserAccessInfoVo>(
      `${ServicePrefixEnum.CONSOLE}/anyone/findUserResource`,
      { params: { appId } },
    );
  }

  /**
   * 获取用户拥有的 指定应用的菜单
   */
  export async function findUserRouter(appId: string) {
    return requestClient.get<RouteRecordStringComponent[]>(
      `${ServicePrefixEnum.CONSOLE}/anyone/findUserRouter`,
      { params: { appId } },
    );
  }

  /**
   * 获取应用的所有菜单
   */
  export async function findAllMenu(appId: string) {
    return requestClient.get<RouteRecordStringComponent[]>(
      `${ServicePrefixEnum.CONSOLE}/anyUser/findAllMenu`,
      { params: { appId } },
    );
  }

  /**
   * 获取用户信息
   */
  export async function getUserinfo() {
    return requestClient.get<UserInfo>(
      `${ServicePrefixEnum.CONSOLE}/anyone/getUserinfo`,
    );
  }
  // 以下待完善--------------------------------------------------------------------------------
  /**
   * 扮演用户
   * @param data 参数
   */
  export async function playUser(data: any) {
    return requestClient.post(
      `${ServicePrefixEnum.CONSOLE}/sys/playUser`,
      data,
    );
  }

  /**
   * 退出扮演
   * @param data 参数
   */
  export async function unPlayUser(data: any) {
    return requestClient.post(
      `${ServicePrefixEnum.CONSOLE}/sys/unPlayUser`,
      data,
    );
  }

  /* 修改个人资料 */
  export async function updateBaseInfo(
    data: UserModel.DefUserBaseInfoUpdateVO,
  ) {
    return requestClient.put(UserConfig.UpdateBaseInfo.url as string, data);
  }

  export async function updatePassword(
    data: UserModel.DefUserPasswordUpdateVO,
  ) {
    return requestClient.put(UserConfig.UpdatePassword.url as string, data);
  }

  export async function updateEmail(data: UserModel.DefUserEmailUpdateVO) {
    return requestClient.put(UserConfig.UpdateEmail.url as string, data);
  }

  export async function updateMobile(data: UserModel.DefUserMobileUpdateVO) {
    return requestClient.put(UserConfig.UpdateMobile.url as string, data);
  }
}
