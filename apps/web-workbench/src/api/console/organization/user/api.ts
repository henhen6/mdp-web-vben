import type { UserType } from './model';

import { RequestEnum, ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const SERVICE_PREFIX = ServicePrefixEnum.CONSOLE;
const MODULAR = `${SERVICE_PREFIX}/organization/user`;

export const UserConfig = {
  UpdateProfile: {
    url: `${ServicePrefixEnum.WORKBENCH}/profile/updateProfile`,
    method: RequestEnum.POST,
  },
};

export namespace UserApi {
  /**
   * 批量查询
   *
   * @param params 查询参数
   * @returns 所有数据
   */
  export const list = (params: Partial<UserType.UserQuery>) =>
    requestClient.post<UserType.UserVo[]>(`${MODULAR}/list`, params);

  /**
   * 单体查询
   *
   * @param id id
   * @returns 单个对象
   */
  export const getById = (id: string) =>
    requestClient.get<UserType.UserVo>(`${MODULAR}/getById`, {
      params: { id },
    });

  /**
   * 修改数据
   *
   * @param params 参数
   * @returns 主键ID
   */
  export const updateProfile = (params: Partial<UserType.UserDto>) =>
    requestClient.post<string>(UserConfig.UpdateProfile.url as string, params);
}
