import type { SecurityType } from './model';

import { RequestEnum, ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const SERVICE_PREFIX = ServicePrefixEnum.WORKBENCH;
const MODULAR = `${SERVICE_PREFIX}/profile`;

export const SecurityConfig = {
  UpdateProfile: {
    url: `${MODULAR}/updateProfile`,
    method: RequestEnum.POST,
  },
  UpdatePhone: {
    url: `${MODULAR}/updatePhone`,
    method: RequestEnum.POST,
  },
  UpdateEmail: {
    url: `${MODULAR}/updateEmail`,
    method: RequestEnum.POST,
  },
  UpdatePassword: {
    url: `${MODULAR}/updatePassword`,
    method: RequestEnum.POST,
  },
};

export namespace SecurityApi {
  /**
   * 修改个人信息
   *
   * @param params 参数
   * @returns 主键ID
   */
  export const updateProfile = (params: Partial<SecurityType.ProfileUserDto>) =>
    requestClient.post<string>(
      SecurityConfig.UpdateProfile.url as string,
      params,
    );
  /**
   * 修改手机号
   *
   * @param params 参数
   * @returns 主键ID
   */
  export const updatePhone = (params: Partial<SecurityType.ProfilePhoneDto>) =>
    requestClient.post<string>(
      SecurityConfig.UpdatePhone.url as string,
      params,
    );
  /**
   * 修改邮箱
   *
   * @param params 参数
   * @returns 主键ID
   */
  export const updateEmail = (params: Partial<SecurityType.ProfileEmailDto>) =>
    requestClient.post<string>(
      SecurityConfig.UpdateEmail.url as string,
      params,
    );
  /**
   * 修改密码
   *
   * @param params 参数
   * @returns 主键ID
   */
  export const updatePassword = (
    params: Partial<SecurityType.ProfilePasswordDto>,
  ) =>
    requestClient.post<string>(
      SecurityConfig.UpdatePassword.url as string,
      params,
    );

  /**
   * 发送短信验证码
   */
  export async function sendPhoneCode(phone: string, oldPhone: string) {
    return requestClient.get(`${MODULAR}/sendPhoneCode`, {
      params: {
        phone,
        oldPhone,
      },
    });
  }

  /**
   * 发送邮件验证码
   */
  export async function sendEmailCode(email: string, oldEmail: string) {
    return requestClient.get(`${MODULAR}/sendEmailCode`, {
      params: {
        email,
        oldEmail,
      },
    });
  }
}
