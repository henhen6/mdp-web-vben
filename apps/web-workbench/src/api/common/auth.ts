import type { AuthModel } from '#/api';

import { ContentTypeEnum, ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const ServicePrefix = ServicePrefixEnum.WORKBENCH;
export namespace AuthApi {
  /**
   * 获取指定应用的重定向地址
   */
  export async function getRedirectUrl(data: AuthModel.GetRedirectUrlDTO) {
    return requestClient.post<string>(
      `${ServicePrefix}/anyUser/sso/getRedirectUrl`,
      data,
      {
        headers: {
          'Content-Type': ContentTypeEnum.FORM_URLENCODED,
        },
      },
    );
  }

  /**
   * 登录
   */
  export async function login(data: AuthModel.LoginDTO) {
    return requestClient.post<AuthModel.LoginVO>(
      `${ServicePrefix}/anyUser/auth/login`,
      data,
    );
  }

  /**
   * 根据手机号注册
   */
  export async function registerByMobile(params: AuthModel.RegisterByMobileVO) {
    return requestClient.post(
      `${ServicePrefix}/anyUser/auth/registerByMobile`,
      params,
    );
  }

  /**
   * 退出登录，仅退出当前应用
   */
  export async function logout() {
    return requestClient.post(`${ServicePrefix}/anyUser/sso/logout`);
  }

  /**
   * 单点注销, 所有应用都退出
   */
  export async function signout(clientId?: string) {
    return requestClient.post(
      `${ServicePrefix}/anyUser/sso/signout`,
      {
        clientId,
        singleDeviceIdLogout: true, // 注销当前浏览器的回话
      },
      { headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED } },
    );
  }
}
