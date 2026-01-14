import type { LoginLogType } from './model';

import type { PageParams, PageResult } from '#/api';

import { ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const SERVICE_PREFIX = ServicePrefixEnum.WORKBENCH;
const MODULAR = `${SERVICE_PREFIX}/loginLog`;

export namespace LoginLogApi {
  /**
   * 分页查询
   *
   * @param params 分页参数
   * @returns 每页数据
   */
  export const page = (
    params: PageParams<Partial<LoginLogType.LoginLogQuery>>,
  ) =>
    requestClient.post<PageResult<LoginLogType.LoginLogVo>>(
      `${MODULAR}/page`,
      params,
    );

  /**
   * 单体查询
   *
   * @param id id
   * @returns 单个对象
   */
  export const getById = (id: string) =>
    requestClient.get<LoginLogType.LoginLogVo>(`${MODULAR}/getById`, {
      params: { id },
    });

  /**
   * 批量删除
   *
   * @param ids id
   * @returns 是否成功
   */
  export const remove = (ids: string[]) =>
    requestClient.post<boolean>(`${MODULAR}/delete`, ids);
}
